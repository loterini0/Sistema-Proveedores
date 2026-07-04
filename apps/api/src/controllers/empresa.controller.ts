import { Request, Response, NextFunction } from 'express';

export const createEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'Empresa registrada exitosamente.' });
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
    res.json({ productos: [], empresaId: id });
  } catch (err) {
    next(err);
  }
};

export const createProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'Producto publicado.' });
  } catch (err) {
    next(err);
  }
};
