/// <reference types="jest" />

import request from 'supertest';
import { eq } from 'drizzle-orm';
import app from '../app';
import { db } from '../db';
import { users, empresas, categorias, productos } from '../db/schema';

describe('Empresa Endpoints', () => {
  let empresaId: string;
  let userId: string;
  let categoriaId: string;

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

    const [categoria] = await db
      .insert(categorias)
      .values({
        nombre: 'Tecnología',
        slug: `tecnologia-${Date.now()}`,
        activo: true,
      } as any)
      .returning();
    categoriaId = categoria.id;

    const [empresa] = await db
      .insert(empresas)
      .values({
        userId,
        razonSocial: 'Tech Solutions SAS',
        departamento: 'Valle del Cauca',
        categoriaId,
      } as any)
      .returning();
    empresaId = empresa.id;

    await db
      .insert(productos)
      .values({
        empresaId,
        nombre: 'Software de gestión',
        activo: true,
      } as any)
      .returning();

    await db
      .insert(productos)
      .values({
        empresaId,
        nombre: 'Producto inactivo',
        activo: false,
      } as any)
      .returning();
  });

  describe('GET /empresas/:id', () => {
  it('should return empresa by ID with categoria and active products', async () => {
    const res = await request(app).get(`/api/v1/empresas/${empresaId}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(empresaId);
    expect(res.body.data.razonSocial).toBe('Tech Solutions SAS');
    expect(res.body.data.categoria).toBeDefined();
    expect(res.body.data.categoria.id).toBe(categoriaId);
    expect(res.body.data.categoria.nombre).toBe('Tecnología');
    expect(res.body.data.productos).toBeInstanceOf(Array);
    expect(res.body.data.productos).toHaveLength(1);
    expect(res.body.data.productos[0].nombre).toBe('Software de gestión');
  });

  it('should return 404 for non-existent empresa', async () => {
    const res = await request(app).get('/api/v1/empresas/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Empresa no encontrada.');
  });
});

  describe('GET /empresas/search', () => {
    it('should search by q in razonSocial', async () => {
  const res = await request(app)
    .get('/api/v1/empresas/search')
    .query({ q: 'Tech', page: 1, limit: 10 });
  expect(res.status).toBe(200);
  expect(res.body.data.some((e: any) => e.id === empresaId)).toBe(true);
  const empresa = res.body.data.find((e: any) => e.id === empresaId);
  expect(empresa.razonSocial).toBe('Tech Solutions SAS');
  expect(empresa.categoria).toBeDefined();
  expect(empresa.categoria.nombre).toBe('Tecnología');
  expect(res.body.page).toBe(1);
  expect(res.body.limit).toBe(10);
});
    it('should search by q in product name', async () => {
      const res = await request(app).get('/api/v1/empresas/search').query({ q: 'Software' });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });

    it('should filter by departamento', async () => {
      const res = await request(app)
        .get('/api/v1/empresas/search')
        .query({ departamento: 'Valle del Cauca' });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });

    it('should filter by categoriaId', async () => {
      const res = await request(app).get('/api/v1/empresas/search').query({ categoriaId });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });

    it('should combine q + departamento + categoriaId', async () => {
      const res = await request(app)
        .get('/api/v1/empresas/search')
        .query({ q: 'Tech', departamento: 'Valle del Cauca', categoriaId });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
    });

    it('should return empty when q does not match', async () => {
      const res = await request(app)
        .get('/api/v1/empresas/search')
        .query({ q: 'xyz-non-existent' });
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });

  afterAll(async () => {
    await db.delete(productos).where(eq(productos.empresaId, empresaId));
    await db.delete(empresas).where(eq(empresas.id, empresaId));
    await db.delete(categorias).where(eq(categorias.id, categoriaId));
    await db.delete(users).where(eq(users.id, userId));
  });
});
