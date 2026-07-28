import { Router } from 'express';
import { createRFQ, getRFQ, listRFQs, submitCotizacion, getCotizaciones } from '../controllers/rfq.controller';
import { authenticate } from '../middleware/authenticate';
import { uploadMiddleware } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { createRFQSchema, listRFQsSchema } from '../types/rfq.schemas';
import { createCotizacionSchema } from '../types/cotizacion.schemas';

const router = Router();

router.use(authenticate);
router.post('/', uploadMiddleware, validate(createRFQSchema), createRFQ);
router.get('/', validate(listRFQsSchema), listRFQs);
router.get('/:id', getRFQ);
router.post('/:id/cotizaciones', uploadMiddleware, validate(createCotizacionSchema), submitCotizacion);
router.get('/:id/cotizaciones', getCotizaciones);

export default router;
