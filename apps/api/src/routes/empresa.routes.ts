import { Router } from 'express';
import { createEmpresa, getEmpresa, updateEmpresa, searchEmpresas, getProductos, createProducto } from '../controllers/empresa.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/search', searchEmpresas);
router.get('/:id', getEmpresa);
router.post('/', authenticate, createEmpresa);
router.put('/:id', authenticate, updateEmpresa);
router.get('/:id/productos', getProductos);
router.post('/:id/productos', authenticate, createProducto);

export default router;
