import { Router } from 'express';
import { categoriaController } from '../controllers/categoria.controller';

const router = Router();

router.get('/', categoriaController.listar); // público, sin authenticate

export default router;