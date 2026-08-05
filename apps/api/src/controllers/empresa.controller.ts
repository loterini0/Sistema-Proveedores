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
    const empresa = await empresaService.getEmpresaWithProfile(id);

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada.' });
    }

    res.json({ data: empresa });
  } catch (err) {
    next(err);
  }
};

export const updateEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const empresa = await empresaService.getEmpresaWithProfile(id);
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa no encontrada.' });
    }

    if (empresa.userId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta empresa.' });
    }

    const actualizada = await empresaService.updateEmpresa(id, req.body);

    res.json({
      message: 'Empresa actualizada.',
      empresa: actualizada,
    });
  } catch (err) {
    next(err);
  }
};

export const searchEmpresas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, departamento, categoriaId, page = 1, limit = 10 } = req.query as Record<string, any>;

    const result = await empresaService.searchEmpresas({
      q,
      departamento,
      categoriaId,
      page: Number(page),
      limit: Number(limit),
    });

    res.json({
      data: result.empresas,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
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
    const userId = (req as any).user?.userId;
    // No confiamos en el empresaId del JWT por la misma razón de siempre:
    // puede estar desactualizado si la empresa se creó después del login.
    const empresa = await empresaService.getEmpresaByUserId(userId);

    if (!empresa || empresa.id !== id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para agregar productos a esta empresa.' });
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

export const updateProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, productoId } = req.params;
    const userId = (req as any).user?.userId;
    const empresa = await empresaService.getEmpresaByUserId(userId);

    if (!empresa || empresa.id !== id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para editar productos de esta empresa.' });
    }

    const producto = await productoService.getProductoById(productoId);
    if (!producto || producto.empresaId !== id) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const actualizado = await productoService.updateProducto(productoId, req.body);

    res.json({
      message: 'Producto actualizado.',
      producto: actualizado,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProducto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, productoId } = req.params;
    const userId = (req as any).user?.userId;
    const empresa = await empresaService.getEmpresaByUserId(userId);

    if (!empresa || empresa.id !== id) {
      return res
        .status(403)
        .json({ error: 'No tienes permiso para eliminar productos de esta empresa.' });
    }

    const producto = await productoService.getProductoById(productoId);
    if (!producto || producto.empresaId !== id) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await productoService.deleteProducto(productoId);

    res.json({ message: 'Producto eliminado.' });
  } catch (err) {
    next(err);
  }
};
