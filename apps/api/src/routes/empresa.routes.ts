import { Router } from 'express';
import {
  createEmpresa,
  getEmpresa,
  updateEmpresa,
  searchEmpresas,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../controllers/empresa.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createEmpresaSchema, searchEmpresasSchema, updateEmpresaSchema } from '../types/empresa.schemas';
import { createProductoSchema, updateProductoSchema } from '../types/producto.schemas';

const router = Router();

router.get('/search', validate(searchEmpresasSchema), searchEmpresas);
router.get('/:id', getEmpresa);
router.post('/', authenticate, validate(createEmpresaSchema), createEmpresa);
router.put('/:id', authenticate, validate(updateEmpresaSchema), updateEmpresa);
router.get('/:id/productos', getProductos);
router.post('/:id/productos', authenticate, validate(createProductoSchema), createProducto);
router.put('/:id/productos/:productoId', authenticate, validate(updateProductoSchema), updateProducto);
router.delete('/:id/productos/:productoId', authenticate, deleteProducto);

export default router;
