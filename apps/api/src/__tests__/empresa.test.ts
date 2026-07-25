/// <reference types="jest" />

import request from 'supertest';
import { eq } from 'drizzle-orm';
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
      } as any)
      .returning();
    userId = user.id;

    const [empresa] = await db
      .insert(empresas)
      .values({
        userId,
        razonSocial: 'Tech Solutions SAS',
      } as any)
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
      const res = await request(app).get('/api/v1/empresas/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Empresa no encontrada.');
    });
  });

  describe('GET /empresas/search', () => {
    it('should search empresas by razonSocial', async () => {
      const res = await request(app)
        .get('/api/v1/empresas/search')
        .query({ query: 'Tech', page: 1, limit: 10 });
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.total).toBeGreaterThanOrEqual(0);
      expect(res.body.page).toBe(1);
      expect(res.body.limit).toBe(10);
    });

    it('should return 400 if query is missing', async () => {
      const res = await request(app).get('/api/v1/empresas/search').query({ page: 1 });
      expect(res.status).toBe(400);
    });
  });

  afterAll(async () => {
    await db.delete(empresas).where(eq(empresas.id, empresaId));
    await db.delete(users).where(eq(users.id, userId));
  });
});
