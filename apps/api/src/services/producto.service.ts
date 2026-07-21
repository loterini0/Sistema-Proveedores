import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { productos } from "../db/schema";
import type { CreateProductoDTO } from "../types/producto.schemas";

const DEFAULT_MAX_PRODUCTOS = 50;

export const productoService = {
  async getProductosByEmpresa(empresaId: string) {
    return db
      .select()
      .from(productos)
      .where(and(eq(productos.empresaId, empresaId), eq(productos.activo, true)));
  },

  async countProductosByEmpresa(empresaId: string) {
    const [result] = await db
      .select({ total: count() })
      .from(productos)
      .where(eq(productos.empresaId, empresaId));
    return result.total;
  },

  async createProducto(empresaId: string, data: CreateProductoDTO) {
    const totalProductos = await this.countProductosByEmpresa(empresaId);
    const limite = Number(process.env.MAX_PRODUCTOS_POR_EMPRESA) || DEFAULT_MAX_PRODUCTOS;

    if (totalProductos >= limite) {
      throw Object.assign(new Error(`La empresa alcanzó el límite de ${limite} productos`), {
        status: 409,
      });
    }

    const [producto] = await db
      .insert(productos)
      .values({ empresaId, ...data })
      .returning();

    return producto;
  },
};