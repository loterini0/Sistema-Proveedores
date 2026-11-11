import { randomUUID } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app';
import { db, pool } from '../db';
import { cotizaciones, empresas, rfqDestinatarios, rfqs, users } from '../db/schema';

const endpoint = '/api/v1/rfq';
const actorIds = [randomUUID(), randomUUID(), randomUUID()];
const [buyerId, supplierId, otherId] = actorIds;
const [supplierCompanyId, otherCompanyId] = [randomUUID(), randomUUID()];
const fields = {
  titulo: 'Solicitud de prueba',
  descripcion: 'Una solicitud privada de prueba',
  fechaLimite: '2099-12-31',
};

const auth = (userId: string) =>
  `Bearer ${jwt.sign({ userId }, process.env.JWT_SECRET!)}`;

const create = () => request(app).post(endpoint).set('Authorization', auth(buyerId)).field(fields);

beforeAll(async () => {
  await db.insert(users).values(actorIds.map((id) => ({
    id,
    nombre: 'Usuario de prueba',
    email: `${id}@example.com`,
    passwordHash: 'unused',
  })));
  await db.insert(empresas).values([
    { id: supplierCompanyId, userId: supplierId, razonSocial: 'Empresa invitada' },
    { id: otherCompanyId, userId: otherId, razonSocial: 'Otra empresa' },
  ]);
});

afterAll(async () => {
  try {
    const buyerRfqs = db.select({ id: rfqs.id }).from(rfqs).where(eq(rfqs.compradorId, buyerId));
    await db.delete(cotizaciones).where(inArray(cotizaciones.rfqId, buyerRfqs));
    await db.delete(rfqDestinatarios).where(inArray(rfqDestinatarios.rfqId, buyerRfqs));
    await db.delete(rfqs).where(eq(rfqs.compradorId, buyerId));
    await db.delete(empresas).where(inArray(empresas.userId, actorIds));
    await db.delete(users).where(inArray(users.id, actorIds));
  } finally {
    await pool.end();
  }
});

it('creates a private RFQ from one multipart invitee and restricts access', async () => {
  const response = await create().field('destinatarios', supplierCompanyId).expect(201);
  expect(response.body.rfq.privada).toBe(true);
  const url = `${endpoint}/${response.body.rfq.id}`;
  await request(app).get(url).set('Authorization', auth(supplierId)).expect(200);
  await request(app).get(url).set('Authorization', auth(otherId)).expect(403);
});

it('creates one recipient per company when multipart fields repeat', async () => {
  const response = await create()
    .field('destinatarios', supplierCompanyId)
    .field('destinatarios', otherCompanyId)
    .field('destinatarios', supplierCompanyId)
    .expect(201);
  const detail = await request(app)
    .get(`${endpoint}/${response.body.rfq.id}`)
    .set('Authorization', auth(buyerId))
    .expect(200);
  expect(detail.body.data.destinatarios.sort()).toEqual([supplierCompanyId, otherCompanyId].sort());
});

it('leaves no RFQ behind when an invitee does not exist', async () => {
  const title = randomUUID();
  await request(app).post(endpoint).set('Authorization', auth(buyerId))
    .field({ ...fields, titulo: title })
    .field('destinatarios', supplierCompanyId)
    .field('destinatarios', randomUUID())
    .expect(400);
  const rows = await db.select().from(rfqs).where(eq(rfqs.titulo, title));
  expect(rows).toHaveLength(0);
});

it('rejects attachments explicitly', async () => {
  await create().field('destinatarios', supplierCompanyId)
    .attach('adjuntos', Buffer.from('file'), 'document.pdf')
    .expect(400, { error: 'Esta solicitud no admite archivos adjuntos.' });
});

it('accepts only one quote when the same supplier submits concurrently', async () => {
  const response = await create().field('destinatarios', supplierCompanyId).expect(201);
  const submit = () => request(app).post(`${endpoint}/${response.body.rfq.id}/cotizaciones`)
    .set('Authorization', auth(supplierId))
    .send({ precioTotal: '100', plazoEntrega: '5 días' });
  const results = await Promise.all([submit(), submit()]);
  expect(results.map((result) => result.status).sort()).toEqual([201, 409]);
});
