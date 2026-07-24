import { Request, Response } from 'express';
import { categoriaService } from '../services/categoria.service';

export const categoriaController = {
  async listar(req: Request, res: Response) {
    try {
      const categorias = await categoriaService.listarActivas();
      res.status(200).json(categorias);
    } catch (err) {
      console.error('Error listando categorias:', err);
      res.status(500).json({ message: 'Error al obtener categorias' });
    }
  },
};