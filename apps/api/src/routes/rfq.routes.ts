import { Router } from 'express';
import { createRFQ, getRFQ, listRFQs, submitCotizacion, getCotizaciones } from '../controllers/rfq.controller';
import { authenticate } from '../middleware/authenticate';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

router.use(authenticate);
router.post('/', uploadMiddleware, createRFQ);
router.get('/', listRFQs);
router.get('/:id', getRFQ);
router.post('/:id/cotizaciones', uploadMiddleware, submitCotizacion);
router.get('/:id/cotizaciones', getCotizaciones);

export default router;
