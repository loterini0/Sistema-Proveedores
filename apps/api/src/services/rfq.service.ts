import { eq } from "drizzle-orm";
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
};