import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../types/auth.schemas';
import { empresaService } from '../services/empresa.service';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', authenticate, async (req, res, next) => {
  try {
    // No confiamos en el empresaId embebido en el JWT: si el usuario creó
    // su empresa después de haber iniciado sesión, el token quedaría
    // desactualizado hasta el próximo login. Lo resolvemos desde la DB.
    const tokenUser = (req as any).user;
    const empresa = await empresaService.getEmpresaByUserId(tokenUser.userId);

    res.json({
      user: { ...tokenUser, empresaId: empresa?.id ?? null },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
