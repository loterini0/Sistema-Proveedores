import request from 'supertest';
import app from '../app';
import { db } from '../db';
import { users, empresas } from '../db/schema';

describe('Empresa Endpoints', () => {
  let empresaId: string;
  let userId: string;

  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({
        nombre: 'Test User',
        email: `test-${Date.now()}@example.com`,
        passwordHash: 'hashed',
        emailVerified: true,
      })
      .returning();
    userId = user.id;

    const [empresa] = await db
      .insert(empresas)
      .values({
        userId,
        razonSocial: 'Tech Solutions SAS',
        nit: '123456789',
        sector: 'Technology',
        sectorNivel2: 'Software',
        descripcion: 'Leading software development company',
        ciudad: 'Bogota',
        departamento: 'Cundinamarca',
        telefono: '+57 1 1234567',
        website: 'https://techsolutions.com',
        activo: true,
      })
      .returning();
    empresaId = empresa.id;
  });

  describe('GET /empresas/:id', () => {
    it('should return empresa by ID', async () => {
      const res = await request(app).get(`/api/v1/empresas/${empresaId}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(empresaId);
      expect(res.body.data.razonSocial).toBe('Tech Solutions SAS');
    });

    it('should return 404 for non-existent empresa', async () => {
      const res = await request(app).get(`/api/v1/empresas/00000000-0000-0000-0000-000000000000`);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Empresa no encontrada.');
    });
  });

  afterAll(async () => {
    await db.delete(empresas).where({ id: empresaId });
    await db.delete(users).where({ id: userId });
  });
});
