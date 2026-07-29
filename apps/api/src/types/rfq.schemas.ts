import { z } from 'zod';

const normalizeEmpresasDestinatarias = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => `${item}`.trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => `${item}`.trim()).filter(Boolean);
      }
    } catch {
      // Si no es JSON válido, seguimos con el fallback por coma.
    }
  }

  if (trimmed.includes(',')) {
    return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [trimmed];
};

export const createRFQSchema = z.object({
  titulo: z.string().trim().min(1, 'El titulo es obligatorio').max(255),
  descripcion: z.string().trim().min(1, 'La descripcion es obligatoria').max(5000),
  cantidad: z.string().trim().max(100).optional(),
  presupuesto: z.string().trim().max(100).optional(),
  fechaLimite: z.preprocess((value) => {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : parsed;
    }

    return value;
  }, z.date({ invalid_type_error: 'fechaLimite debe ser una fecha valida' })),
  empresasDestinatarias: z.preprocess(
    normalizeEmpresasDestinatarias,
    z.array(z.string().uuid('Cada empresa destinataria debe ser un uuid valido')).min(1, 'Debes invitar al menos una empresa'),
  ),
});

export type CreateRFQDTO = z.infer<typeof createRFQSchema>;