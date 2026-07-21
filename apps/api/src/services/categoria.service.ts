import { eq, asc } from 'drizzle-orm';
import { db } from '../db';
import { categorias } from '../db/schema';

export const categoriaService = {
  async listarActivas() {
    return db
      .select({
        id: categorias.id,
        nombre: categorias.nombre,
        slug: categorias.slug,
        parentId: categorias.parentId,
      })
      .from(categorias)
      .where(eq(categorias.activo, true))
      .orderBy(asc(categorias.orden));
  },
};