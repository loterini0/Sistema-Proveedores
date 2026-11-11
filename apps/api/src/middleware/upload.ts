import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const parseMultipart = multer({ limits: { fields: 110, fieldSize: 64 * 1024 } }).none();

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  parseMultipart(req, res, (err?: unknown) => {
    if (err instanceof multer.MulterError) {
      const error = err.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'Esta solicitud no admite archivos adjuntos.'
        : 'La solicitud multipart excede los límites permitidos.';
      return res.status(400).json({ error });
    }
    if (err) {
      return res.status(400).json({ error: 'Solicitud multipart inválida.' });
    }
    next();
  });
};
