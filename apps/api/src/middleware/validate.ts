import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const data = req.method === 'GET' ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.flatten().fieldErrors,
      });
    }
    if (req.method === 'GET') {
      req.query = result.data;
    } else {
      req.body = result.data;
    }
    next();
  };
