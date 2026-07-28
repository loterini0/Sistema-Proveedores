/// <reference types="jest" />

import request from 'supertest';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import app from '../app';
import { db } from '../db';
import { users, empresas, categorias } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function tokenFor(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

describe('PUT /empresas/:id', () => {
  let categoriaId: string;
  let ownerId: string;
  let ownerToken: string;
  let otherUserId: string;
  let otherUserToken: string;
  let empresaId: string;

  beforeAll(async () => {
    const [categoria] = await db
      .insert(categorias)
      .values({ nombre: 'Manufactura', slug: `manufactura-${Date.now()}`, activo: true } as any)
      .returning();
    categoriaId = categoria.id;

    const [owner] = await db
      .insert(users)
      .values({
        nombre: 'Dueña Empresa',
        email: `owner-${Date.now()}@example.com`,
        passwordHash: 'hashed',
        emailVerified: true,
      } as any)
      .returning();
    ownerId = owner.id;
    ownerToken = tokenFor(ownerId);

    const [otherUser] = await db
      .insert(users)
      .values({
        nombre: 'Otro Usuario',
        email: `other-${Date.now()}@example.com`,
        passwordHash: 'hashed',
        emailVerified: true,
      } as any)
      .returning();
    otherUserId = otherUser.id;
    otherUserToken = tokenFor(otherUserId);

    const [empresa] = await db
      .insert(empresas)
      .values({ userId: ownerId, razonSocial: 'Original SAS', categoriaId, ciudad: 'Manizales' } as any)
      .returning();
    empresaId = empresa.id;
  });

  afterAll(async () => {
    await db.delete(empresas).where(eq(empresas.id, empresaId));
    await db.delete(categorias).where(eq(categorias.id, categoriaId));
    await db.delete(users).where(eq(users.id, ownerId));
    await db.delete(users).where(eq(users.id, otherUserId));
  });

  it('el dueño puede actualizar su empresa', async () => {
    const res = await request(app)
      .put(`/api/v1/empresas/${empresaId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ descripcion: 'Empresa líder en manufactura textil' });

    expect(res.status).toBe(200);
    expect(res.body.empresa.descripcion).toBe('Empresa líder en manufactura textil');
    // el resto de los campos no debería perderse
    expect(res.body.empresa.razonSocial).toBe('Original SAS');
  });

  it('otro usuario NO puede actualizar una empresa que no es suya', async () => {
    const res = await request(app)
      .put(`/api/v1/empresas/${empresaId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ descripcion: 'Intento no autorizado' });

    expect(res.status).toBe(403);
  });

  it('devuelve 404 si la empresa no existe', async () => {
    const res = await request(app)
      .put('/api/v1/empresas/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ descripcion: 'no importa' });

    expect(res.status).toBe(404);
  });

  it('rechaza sin token', async () => {
    const res = await request(app)
      .put(`/api/v1/empresas/${empresaId}`)
      .send({ descripcion: 'sin auth' });

    expect(res.status).toBe(401);
  });
});