import { Router } from 'express';
import { getRecientes } from '../controllers/producto.controller';

const router = Router();
router.get('/recientes', getRecientes); // público

export default router;