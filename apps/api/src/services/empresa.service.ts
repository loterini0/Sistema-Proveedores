import { eq } from 'drizzle-orm';
import { db } from '../db';
import { empresas } from '../db/schema';
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
};
