import { z } from 'zod';

export const createEmpresaSchema = z.object({
  razonSocial: z.string().min(2).max(255),
  nit: z.string().min(1).max(20).optional(),
  categoriaId: z.string().uuid('categoriaId debe ser un uuid válido'),
  descripcion: z.string().max(2000).optional(),
  ciudad: z.string().min(1).max(100).optional(),
  departamento: z.string().min(1).max(100).optional(),
  telefono: z.string().min(1).max(20).optional(),
  website: z.string().url().max(255).optional(),
  logoUrl: z.string().url().max(500).optional(),
});

export type CreateEmpresaDTO = z.infer<typeof createEmpresaSchema>;
