import { and, count, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { empresas, rfqDestinatarios, rfqs } from '../db/schema';
import type { CreateRFQDTO } from '../types/rfq.schemas';

type UploadedFile = Express.Multer.File;

const buildArchivoUrl = (file: UploadedFile) => {
  const base64 = file.buffer.toString('base64');
  return `data:${file.mimetype};base64,${base64}`;
};

export const rfqService = {
  async createRFQ(userId: string, data: CreateRFQDTO, files: UploadedFile[] = []) {
    const empresasDestinatarias = Array.from(new Set(data.empresasDestinatarias));

    return db.transaction(async (tx) => {
      const empresasEncontradas = await tx
        .select({ id: empresas.id })
        .from(empresas)
        .where(and(inArray(empresas.id, empresasDestinatarias), eq(empresas.activo, true)));

      if (empresasEncontradas.length !== empresasDestinatarias.length) {
        throw Object.assign(
          new Error('Una o más empresas destinatarias no existen o están inactivas.'),
          {
            status: 400,
          },
        );
      }

      const archivosUrls = files.map(buildArchivoUrl);

      const [rfq] = await tx
        .insert(rfqs)
        .values({
          compradorId: userId,
          titulo: data.titulo,
          descripcion: data.descripcion,
          cantidad: data.cantidad,
          presupuesto: data.presupuesto,
          fechaLimite: data.fechaLimite,
          privada: true,
          archivosUrls,
          status: 'active',
        })
        .returning();

      await tx.insert(rfqDestinatarios).values(
        empresasDestinatarias.map((empresaId) => ({
          rfqId: rfq.id,
          empresaId,
        })),
      );

      return rfq;
    });
  },

  async getRFQById(id: string) {
    const [rfq] = await db.select().from(rfqs).where(eq(rfqs.id, id)).limit(1);

    return rfq ?? null;
  },

  async listRFQsByComprador(
    compradorId: string,
    estado?: typeof rfqs.$inferSelect.status,
    page = 1,
    limit = 20,
  ) {
    const whereCondition = estado
      ? and(eq(rfqs.compradorId, compradorId), eq(rfqs.status, estado))
      : eq(rfqs.compradorId, compradorId);

    const [rfqsResult, totalResult] = await Promise.all([
      db
        .select()
        .from(rfqs)
        .where(whereCondition)
        .limit(limit)
        .offset((page - 1) * limit),
      db.select({ total: count() }).from(rfqs).where(whereCondition),
    ]);

    return {
      rfqs: rfqsResult,
      total: totalResult[0].total,
      page,
      limit,
    };
  },
};
