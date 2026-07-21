import { Request, Response, NextFunction } from 'express';
import { empresaService } from '../services/empresa.service';
import { productoService } from '../services/producto.service';

export const createEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Token requerido.' });
    }

    const existing = await empresaService.getEmpresaByUserId(userId);
    if (existing) {
      return res.status(409).json({ error: 'Ya tienes una empresa registrada.' });
    }

    const empresa = await empresaService.createEmpresa(userId, req.body);

    res.status(201).json({
      message: 'Empresa registrada exitosamente.',
      empresa,
    });
  } catch (err) {
    next(err);
  }
};

export const getEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    res.json({ id, nombre: 'Empresa Ejemplo SAS' });
  } catch (err) {
    next(err);
  }
};

export const updateEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Empresa actualizada.' });
  } catch (err) {
    next(err);
  }
};

export const searchEmpresas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    res.json({ empresas: [], total: 0, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

export const getProductos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const productos = await productoService.getProductosByEmpresa(id);
    res.json({ productos });
  } catch (err) {
    next(err);
  }
};

export const createProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const empresaId = (req as any).user?.empresaId;

    if (!empresaId || empresaId !== id) {
      return res.status(403).json({ error: 'No tienes permiso para agregar productos a esta empresa.' });
    }

    const producto = await productoService.createProducto(id, req.body);

    res.status(201).json({
      message: 'Producto publicado.',
      producto,
    });
  } catch (err) {
    next(err);
  }
};