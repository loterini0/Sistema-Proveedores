import { Request, Response, NextFunction } from 'express';

export const createRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'RFQ publicada exitosamente.' });
  } catch (err) { next(err); }
};

export const listRFQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ rfqs: [], total: 0 });
  } catch (err) { next(err); }
};

export const getRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    res.json({ id, titulo: 'RFQ Ejemplo' });
  } catch (err) { next(err); }
};

export const submitCotizacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({ message: 'Cotización enviada exitosamente.' });
  } catch (err) { next(err); }
};

export const getCotizaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    res.json({ rfqId: id, cotizaciones: [] });
  } catch (err) { next(err); }
};
