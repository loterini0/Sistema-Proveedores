import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { empresas, productos } from "../db/schema";
import type { CreateProductoDTO, UpdateProductoDTO } from "../types/producto.schemas";

const DEFAULT_MAX_PRODUCTOS = 50;

export const productoService = {
  async getProductosByEmpresa(empresaId: string) {
    return db
      .select()
      .from(productos)
      .where(and(eq(productos.empresaId, empresaId), eq(productos.activo, true)));
  },

  async getProductoById(id: string) {
    const [producto] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
    return producto ?? null;
  },

  async getRecientes(limit = 8) {
    return db
      .select({
        id: productos.id,
        nombre: productos.nombre,
        precio: productos.precio,
        imagenUrl: productos.imagenUrl,
        empresaId: productos.empresaId,
        empresaNombre: empresas.razonSocial,
      })
      .from(productos)
      .innerJoin(empresas, eq(productos.empresaId, empresas.id))
      .where(eq(productos.activo, true))
      .orderBy(desc(productos.createdAt))
      .limit(limit);
  },

  async getById(id: string) {
  const [result] = await db
    .select({
      producto: productos,
      empresaId: empresas.id,
      empresaNombre: empresas.razonSocial,
      empresaCiudad: empresas.ciudad,
      empresaVerificada: empresas.verificada,
    })
    .from(productos)
    .innerJoin(empresas, eq(productos.empresaId, empresas.id))
    .where(eq(productos.id, id))
    .limit(1);

  if (!result) return null;

  return {
    ...result.producto,
    empresa: {
      id: result.empresaId,
      razonSocial: result.empresaNombre,
      ciudad: result.empresaCiudad,
      verificada: result.empresaVerificada,
    },
  };
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

  async updateProducto(id: string, data: UpdateProductoDTO) {
    const [producto] = await db
      .update(productos)
      .set(data)
      .where(eq(productos.id, id))
      .returning();

    return producto ?? null;
  },

  // Borrado lógico: activo=false, para no perder el historial en cotizaciones
  // pasadas que puedan referenciar el producto.
  async deleteProducto(id: string) {
    const [producto] = await db
      .update(productos)
      .set({ activo: false })
      .where(eq(productos.id, id))
      .returning();

    return producto ?? null;
  },
};