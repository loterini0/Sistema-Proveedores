import { z } from "zod";

export const createProductoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede superar los 255 caracteres"),

  descripcion: z.string().optional(),

  precio: z.string().optional(),

  imagenUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .max(500, "La URL no puede superar los 500 caracteres")
    .optional(),
});

export type CreateProductoDTO = z.infer<typeof createProductoSchema>;