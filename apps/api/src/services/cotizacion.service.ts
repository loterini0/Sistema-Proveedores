import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { cotizaciones, users, empresas } from '../db/schema';
import type { CreateCotizacionDTO } from '../types/cotizacion.schemas';

export const cotizacionService = {
  async yaCotizo(rfqId: string, proveedorId: string) {
    const [existing] = await db
      .select({ id: cotizaciones.id })
      .from(cotizaciones)
      .where(and(eq(cotizaciones.rfqId, rfqId), eq(cotizaciones.proveedorId, proveedorId)))
      .limit(1);

    return Boolean(existing);
  },

  async createCotizacion(
    rfqId: string,
    proveedorId: string,
    empresaProveedorId: string | null,
    data: CreateCotizacionDTO,
  ) {
    const [cotizacion] = await db
      .insert(cotizaciones)
      .values({
        rfqId,
        proveedorId,
        empresaProveedorId,
        ...data,
      })
      .returning();

    return cotizacion;
  },

  async getCotizacionesByRFQ(rfqId: string) {
    return db
      .select({
        id: cotizaciones.id,
        rfqId: cotizaciones.rfqId,
        precioUnitario: cotizaciones.precioUnitario,
        precioTotal: cotizaciones.precioTotal,
        plazoEntrega: cotizaciones.plazoEntrega,
        condicionesPago: cotizaciones.condicionesPago,
        observaciones: cotizaciones.observaciones,
        ganadora: cotizaciones.ganadora,
        createdAt: cotizaciones.createdAt,
        proveedor: {
          id: users.id,
          nombre: users.nombre,
          email: users.email,
        },
        empresaProveedor: {
          id: empresas.id,
          razonSocial: empresas.razonSocial,
          logoUrl: empresas.logoUrl,
          verificada: empresas.verificada,
        },
      })
      .from(cotizaciones)
      .leftJoin(users, eq(cotizaciones.proveedorId, users.id))
      .leftJoin(empresas, eq(cotizaciones.empresaProveedorId, empresas.id))
      .where(eq(cotizaciones.rfqId, rfqId))
      .orderBy(desc(cotizaciones.createdAt));
  },
};