import { Request, Response, NextFunction } from 'express';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'Usuario creado. Revisa tu email para verificar tu cuenta.' });
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ accessToken: 'jwt_here', refreshToken: 'refresh_here' });
  } catch (err) { next(err); }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.' });
  } catch (err) { next(err); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) { next(err); }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Email verificado. Ya puedes publicar en el sistema.' });
  } catch (err) { next(err); }
};
