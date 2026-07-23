import { Request, Response, NextFunction } from 'express';
import { rfqService } from '../services/rfq.service';
import { cotizacionService } from '../services/cotizacion.service';

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
    const userId = (req as any).user?.userId;

    const rfq = await rfqService.getRFQById(id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ no encontrada.' });
    }

    if (rfq.compradorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver las cotizaciones de esta RFQ.' });
    }

    const cotizaciones = await cotizacionService.getCotizacionesByRFQ(id);

    res.json({ rfqId: id, cotizaciones });
  } catch (err) {
    next(err);
  }
};
