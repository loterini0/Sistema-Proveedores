import { Request, Response, NextFunction } from 'express';
import { productoService } from '../services/producto.service';

export const getRecientes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productos = await productoService.getRecientes(8);
    res.json({ data: productos });
  } catch (err) {
    next(err);
  }
};