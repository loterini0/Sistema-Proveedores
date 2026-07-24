import { Router } from 'express';
import { createEmpresa, getEmpresa, updateEmpresa, searchEmpresas, getProductos, createProducto } from '../controllers/empresa.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createEmpresaSchema } from '../types/empresa.schemas';
import { createProductoSchema } from '../types/producto.schemas';

const router = Router();

router.get('/search', searchEmpresas);
router.get('/:id', getEmpresa);
router.post('/', authenticate, validate(createEmpresaSchema), createEmpresa);
router.put('/:id', authenticate, updateEmpresa);
router.get('/:id/productos', getProductos);
router.post('/:id/productos', authenticate, validate(createProductoSchema), createProducto);

export default router;
