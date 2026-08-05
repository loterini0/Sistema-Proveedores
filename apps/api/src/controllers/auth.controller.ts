import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { emailService } from '../services/email.service';

// RF-AUTH-01: Registro
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password } = req.body;
    const { user, verifyToken } = await authService.register(nombre, email, password);

    await emailService.enviarVerificacion(email, nombre, verifyToken); // reemplaza el console.log

    res.status(201).json({
      message: 'Usuario creado. Revisa tu email para verificar tu cuenta.',
      userId: user.id,
    });
  } catch (err) {
    next(err);
  }
};

// RF-AUTH-01: Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, nombre: user.nombre, email: user.email, empresaId: user.empresaId },
    });
  } catch (err) {
    next(err);
  }
};

// RF-AUTH-06: Forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    if (result) {
      await emailService.enviarResetPassword(email, result.resetToken); // reemplaza el console.log
    }

    res.json({
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (err) {
    next(err);
  }
};

// RF-AUTH-06: Reset password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: 'Contrasena actualizada correctamente.' });
  } catch (err) {
    next(err);
  }
};

// Verificar email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    await authService.verifyEmail(token);
    res.json({ message: 'Email verificado. Ya puedes iniciar sesion.' });
  } catch (err) {
    next(err);
  }
};
