import { Request, Response, NextFunction } from 'express';
import { rfqService } from '../services/rfq.service';
import { cotizacionService } from '../services/cotizacion.service';
import { empresaService } from '../services/empresa.service';

// RF-RFQ-01: Publicar una RFQ
export const createRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const compradorId = (req as any).user?.userId;
    // No confiamos en el empresaId del JWT: si el usuario creó su empresa
    // después de haber iniciado sesión, el token seguiría diciendo null.
    const empresa = await empresaService.getEmpresaByUserId(compradorId);

    const rfq = await rfqService.createRFQ(compradorId, empresa?.id ?? null, req.body);

    res.status(201).json({
      message: 'RFQ publicada exitosamente.',
      rfq,
    });
  } catch (err) {
    next(err);
  }
};

// RF-RFQ-02: Listar RFQs (por defecto: las que puedo ver — mías, públicas
// e invitaciones privadas; con ?soloMias=true: solo el dashboard del comprador)
export const listRFQs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    const empresa = await empresaService.getEmpresaByUserId(userId);
    const empresaId = empresa?.id ?? null;
    const { estado, soloMias, page = 1, limit = 20 } = req.query;

    const result = soloMias
      ? await rfqService.listRFQsByComprador(userId, estado as any, Number(page), Number(limit))
      : await rfqService.listVisibleRFQs(userId, empresaId, estado as any, Number(page), Number(limit));

    res.json({
      rfqs: result.rfqs,
      total: result.total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    next(err);
  }
};

// RF-RFQ-03: Ver el detalle de una RFQ
export const getRFQ = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const empresa = await empresaService.getEmpresaByUserId(userId);
    const empresaId = empresa?.id ?? null;

    const rfq = await rfqService.getRFQDetail(id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ no encontrada.' });
    }

    const puedeVer = await rfqService.canView(rfq, userId, empresaId);
    if (!puedeVer) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta RFQ.' });
    }

    res.json({ data: rfq });
  } catch (err) {
    next(err);
  }
};

// RF-RFQ-04: Enviar una cotización a una RFQ
export const submitCotizacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const proveedorId = (req as any).user?.userId;
    const empresa = await empresaService.getEmpresaByUserId(proveedorId);
    const empresaProveedorId = empresa?.id ?? null;

    if (!empresaProveedorId) {
      return res.status(400).json({ error: 'Debes registrar tu empresa antes de enviar cotizaciones.' });
    }

    const rfq = await rfqService.getRFQById(id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ no encontrada.' });
    }

    if (rfq.compradorId === proveedorId) {
      return res.status(400).json({ error: 'No puedes cotizar tu propia RFQ.' });
    }

    if (rfq.status !== 'active') {
      return res.status(400).json({ error: 'Esta RFQ no está aceptando cotizaciones.' });
    }

    const puedeVer = await rfqService.canView(rfq, proveedorId, empresaProveedorId);
    if (!puedeVer) {
      return res.status(403).json({ error: 'No tienes permiso para cotizar esta RFQ.' });
    }

    const yaCotizo = await cotizacionService.yaCotizo(id, proveedorId);
    if (yaCotizo) {
      return res.status(409).json({ error: 'Ya enviaste una cotización para esta RFQ.' });
    }

    const cotizacion = await cotizacionService.createCotizacion(
      id,
      proveedorId,
      empresaProveedorId,
      req.body
    );

    res.status(201).json({
      message: 'Cotización enviada exitosamente.',
      cotizacion,
    });
  } catch (err) {
    next(err);
  }
};

// RF-RFQ-05: Ver las cotizaciones recibidas (solo el comprador dueño)
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
