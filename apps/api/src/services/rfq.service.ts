import { and, count, eq, inArray, or } from "drizzle-orm";
import { db } from "../db";
import { rfqs, rfqDestinatarios, categorias, empresas } from "../db/schema";
import type { CreateRFQDTO } from "../types/rfq.schemas";

export const rfqService = {
  async createRFQ(compradorId: string, empresaCompradorId: string | null, data: CreateRFQDTO) {
    const { destinatarios, ...rfqData } = data;

    const [rfq] = await db
      .insert(rfqs)
      .values({
        compradorId,
        empresaCompradorId,
        ...rfqData,
        privada: true, // MVP: siempre privada, sin importar lo que mande el cliente
      })
      .returning();

    await db.insert(rfqDestinatarios).values(
      destinatarios.map((empresaId) => ({
        rfqId: rfq.id,
        empresaId,
      })),
    );

    return rfq;
  },

  async getRFQById(id: string) {
    const [rfq] = await db
      .select()
      .from(rfqs)
      .where(eq(rfqs.id, id))
      .limit(1);

    return rfq ?? null;
  },

  async getRFQDetail(id: string) {
    const [result] = await db
      .select({
        rfq: rfqs,
        categoria: categorias,
        empresaComprador: empresas,
      })
      .from(rfqs)
      .leftJoin(categorias, eq(rfqs.categoriaId, categorias.id))
      .leftJoin(empresas, eq(rfqs.empresaCompradorId, empresas.id))
      .where(eq(rfqs.id, id))
      .limit(1);

    if (!result) return null;

    const destinatarios = await db
      .select({ empresaId: rfqDestinatarios.empresaId })
      .from(rfqDestinatarios)
      .where(eq(rfqDestinatarios.rfqId, id));

    return {
      ...result.rfq,
      categoria: result.categoria ?? undefined,
      empresaComprador: result.empresaComprador ?? undefined,
      destinatarios: destinatarios.map((d) => d.empresaId),
    };
  },

  // Un usuario puede ver la RFQ si: es el comprador, la RFQ es pública,
  // o su empresa está entre los destinatarios invitados.
  async canView(rfq: { compradorId: string; privada: boolean; id: string }, userId: string, empresaId: string | null) {
    if (rfq.compradorId === userId) return true;
    if (!rfq.privada) return true;
    if (!empresaId) return false;

    const [invitado] = await db
      .select({ id: rfqDestinatarios.id })
      .from(rfqDestinatarios)
      .where(and(eq(rfqDestinatarios.rfqId, rfq.id), eq(rfqDestinatarios.empresaId, empresaId)))
      .limit(1);

    return Boolean(invitado);
  },

  async listRFQsByComprador(
    compradorId: string,
    estado?: typeof rfqs.$inferSelect.status,
    page = 1,
    limit = 20
  ) {
    const whereCondition = estado
      ? and(eq(rfqs.compradorId, compradorId), eq(rfqs.status, estado))
      : eq(rfqs.compradorId, compradorId);

    const [rfqsResult, totalResult] = await Promise.all([
      db.select().from(rfqs).where(whereCondition).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(rfqs).where(whereCondition),
    ]);

    return {
      rfqs: rfqsResult,
      total: totalResult[0].total,
    };
  },

  // RFQs que el usuario puede VER: las que publicó + las públicas + las privadas
  // donde su empresa fue invitada como destinataria. Es lo que alimenta el
  // "marketplace" que ven los proveedores, no solo el dashboard del comprador.
  async listVisibleRFQs(
    userId: string,
    empresaId: string | null,
    estado?: typeof rfqs.$inferSelect.status,
    page = 1,
    limit = 20
  ) {
    const invitedRfqIds = empresaId
      ? db
          .select({ rfqId: rfqDestinatarios.rfqId })
          .from(rfqDestinatarios)
          .where(eq(rfqDestinatarios.empresaId, empresaId))
      : null;

    const visibility = invitedRfqIds
      ? or(eq(rfqs.compradorId, userId), eq(rfqs.privada, false), inArray(rfqs.id, invitedRfqIds))
      : or(eq(rfqs.compradorId, userId), eq(rfqs.privada, false));

    const whereCondition = estado ? and(visibility, eq(rfqs.status, estado)) : visibility;

    const [rfqsResult, totalResult] = await Promise.all([
      db.select().from(rfqs).where(whereCondition).limit(limit).offset((page - 1) * limit),
      db.select({ total: count() }).from(rfqs).where(whereCondition),
    ]);

    return {
      rfqs: rfqsResult,
      total: totalResult[0].total,
    };
  },
};