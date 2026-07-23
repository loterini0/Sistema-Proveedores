import { and, count, eq } from "drizzle-orm";
import { db } from "../db";
import { rfqs } from "../db/schema";

export const rfqService = {
  async getRFQById(id: string) {
    const [rfq] = await db
      .select()
      .from(rfqs)
      .where(eq(rfqs.id, id))
      .limit(1);
      
    return rfq ?? null;
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
};