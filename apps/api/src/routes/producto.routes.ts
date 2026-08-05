// producto.routes.ts
import { Router } from 'express';
import { getRecientes, getProducto } from '../controllers/producto.controller';

const router = Router();
router.get('/recientes', getRecientes);
router.get('/:id', getProducto);

export default router;