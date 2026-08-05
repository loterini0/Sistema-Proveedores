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

export const getProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const producto = await productoService.getById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ data: producto });
  } catch (err) {
    next(err);
  }
};