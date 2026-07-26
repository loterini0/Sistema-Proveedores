import { and, countDistinct, eq, ilike, or } from 'drizzle-orm';
import { db } from '../db';
import { empresas, productos, categorias } from '../db/schema';
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

  async getEmpresaWithProfile(id: string) {
    const [result] = await db
      .select({
        empresa: empresas,
        categoria: categorias,
      })
      .from(empresas)
      .leftJoin(categorias, eq(empresas.categoriaId, categorias.id))
      .where(eq(empresas.id, id))
      .limit(1);

    if (!result) return null;

    const activeProducts = await db
      .select()
      .from(productos)
      .where(and(eq(productos.empresaId, id), eq(productos.activo, true)));

    return {
      ...result.empresa,
      categoria: result.categoria ?? undefined,
      productos: activeProducts,
    };
  },

  async searchEmpresas(options: {
    q?: string;
    departamento?: string;
    categoriaId?: string;
    page?: number;
    limit?: number;
  }) {
    const { q, departamento, categoriaId, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(or(ilike(empresas.razonSocial, pattern), ilike(productos.nombre, pattern)));
    }

    if (departamento) {
      conditions.push(eq(empresas.departamento, departamento));
    }

    if (categoriaId) {
      conditions.push(eq(empresas.categoriaId, categoriaId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .selectDistinct({
        empresa: empresas,
        categoria: categorias,
      })
      .from(empresas)
      .leftJoin(productos, eq(empresas.id, productos.empresaId))
      .leftJoin(categorias, eq(empresas.categoriaId, categorias.id))
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ total: countDistinct(empresas.id) })
      .from(empresas)
      .leftJoin(productos, eq(empresas.id, productos.empresaId))
      .where(whereClause);

    return {
      empresas: results.map((row) => ({
        ...row.empresa,
        categoria: row.categoria ?? undefined,
      })),
      total: Number(countResult.total),
      page,
      limit,
    };
  },
};
