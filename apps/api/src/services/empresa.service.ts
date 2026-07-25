import { eq, ilike, or } from 'drizzle-orm';
import { db } from '../db';
import { empresas, productos } from '../db/schema';
import type { CreateEmpresaDTO } from '../types/empresa.schemas';

export const empresaService = {
  async createEmpresa(userId: string, data: CreateEmpresaDTO) {
    const [empresa] = await db
      .insert(empresas)
      .values({
        userId,
        ...data,
      })
      .returning();

    return empresa;
  },

  async getEmpresaByUserId(userId: string) {
    const [empresa] = await db.select().from(empresas).where(eq(empresas.userId, userId)).limit(1);
    return empresa ?? null;
  },

  async getEmpresaById(id: string) {
    const [empresa] = await db.select().from(empresas).where(eq(empresas.id, id)).limit(1);
    return empresa ?? null;
  },

  async searchEmpresas(query: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;

    const condition = or(
      ilike(empresas.razonSocial, searchPattern),
      ilike(empresas.departamento, searchPattern),
      ilike(empresas.ciudad, searchPattern),
      ilike(empresas.descripcion, searchPattern),
      ilike(productos.nombre, searchPattern),
      ilike(productos.descripcion, searchPattern),
    );

    const results = await db
      .selectDistinct({ empresa: empresas })
      .from(empresas)
      .leftJoin(productos, eq(empresas.id, productos.empresaId))
      .where(condition)
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .selectDistinct({ id: empresas.id })
      .from(empresas)
      .leftJoin(productos, eq(empresas.id, productos.empresaId))
      .where(condition);

    return {
      empresas: results.map((row) => row.empresa),
      total: countResult.length,
      page,
      limit,
    };
  },
};
