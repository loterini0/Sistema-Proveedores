import { z } from 'zod';

export const createCotizacionSchema = z.object({
  precioUnitario: z.string().max(100).optional(),
  precioTotal: z.string().max(100).optional(),
  plazoEntrega: z.string().max(100).optional(),
  condicionesPago: z.string().optional(),
  observaciones: z.string().optional(),
});

export type CreateCotizacionDTO = z.infer<typeof createCotizacionSchema>;
