import { z } from 'zod';

export const rfqStatusValues = ['draft', 'active', 'closed', 'awarded', 'cancelled'] as const;

// z.coerce.boolean() convierte CUALQUIER string no vacío a true (incluso "false"),
// lo cual es un problema porque esta ruta acepta multipart/form-data (por los adjuntos),
// donde todos los campos llegan como string. Este helper interpreta "false"/"0" correctamente.
const booleanish = z
  .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
  .transform((v) => v === true || v === 'true' || v === '1');

export const createRFQSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(255),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoriaId: z.string().uuid('categoriaId debe ser un uuid válido').optional(),
  cantidad: z.string().max(100).optional(),
  presupuesto: z.string().max(100).optional(),
  fechaLimite: z.coerce.date().optional(),
  privada: booleanish.optional().default(true),
  // ids de empresas invitadas cuando la RFQ es privada
  destinatarios: z.array(z.string().uuid()).optional().default([]),
});

export const listRFQsSchema = z.object({
  estado: z.enum(rfqStatusValues).optional(),
  // Si es true, solo devuelve las RFQs que YO publiqué (dashboard del comprador).
  // Por defecto, devuelve todas las RFQs que puedo VER: las mías + públicas + privadas donde me invitaron.
  soloMias: z
    .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
    .transform((v) => v === true || v === 'true' || v === '1')
    .optional()
    .default(false),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateRFQDTO = z.infer<typeof createRFQSchema>;
export type ListRFQsDTO = z.infer<typeof listRFQsSchema>;
