import {
  mockRfqs,
  mockCotizaciones,
  mockRfqDestinatarios,
  Rfq,
  RfqStatus,
  Cotizacion,
} from "./mock.data";
import { rfqService as rfqApi } from "./api";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export interface RfqListParams {
  status?: RfqStatus;
}

export const rfqService = {
  list: async (params?: RfqListParams): Promise<Rfq[]> => {
    if (USE_MOCKS) {
      let resultado = mockRfqs;

      if (params?.status) {
        resultado = resultado.filter((r) => r.status === params.status);
      }
      return resultado;
    }

    // El backend responde { rfqs: [...], total, page, limit }
    const { data } = await rfqApi.list(
      params
        ? {
            estado: params.status,
          }
        : undefined,
    );
    return data.rfqs;
  },

  get: async (id: string): Promise<Rfq | undefined> => {
    if (USE_MOCKS) {
      return mockRfqs.find((r) => r.id === id);
    }

    // El backend responde { data: {...} }
    const { data } = await rfqApi.get(id);
    return data.data;
  },

  getCotizaciones: async (rfqId: string): Promise<Cotizacion[]> => {
    if (USE_MOCKS) {
      return mockCotizaciones.filter((c) => c.rfqId === rfqId);
    }

    // El backend responde { rfqId, cotizaciones: [...] }
    const { data } = await rfqApi.getCotizaciones(rfqId);
    return data.cotizaciones;
  },

  // Solo aplica para RFQs privadas: qué empresas fueron invitadas a cotizar.
  // No hay endpoint expuesto todavía en api.ts para esto — si lo agregan,
  // solo hay que reemplazar el bloque `if (USE_MOCKS)` por la llamada real.
  getDestinatarios: async (rfqId: string) => {
    if (USE_MOCKS) {
      return mockRfqDestinatarios.filter((d) => d.rfqId === rfqId);
    }

    throw new Error(
      "getDestinatarios: falta implementar el endpoint real en api.ts",
    );
  },

  // create y submitCotizacion mandan FormData (multipart) y siempre pegan
  // contra la API real, sin importar EXPO_PUBLIC_USE_MOCKS.
  create: async (data: {
    titulo: string;
    descripcion: string;
    cantidad?: string;
    presupuesto?: string;
    fechaLimite: string;
    // MVP: toda RFQ es privada, así que siempre hay que invitar al menos
    // una empresa — el backend rechaza la petición si viene vacío.
    destinatarios: string[];
    attachments?: { uri: string; name: string; mimeType?: string }[];
  }): Promise<Rfq> => {
    const formData = new FormData();
    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    if (data.cantidad) formData.append("cantidad", data.cantidad);
    if (data.presupuesto) formData.append("presupuesto", data.presupuesto);
    formData.append("fechaLimite", data.fechaLimite);
    for (const empresaId of data.destinatarios) {
      formData.append("destinatarios", empresaId);
    }

    for (const file of data.attachments ?? []) {
      // @ts-expect-error React Native FormData acepta este shape para archivos,
      // aunque no calce exactamente con el tipo Blob del DOM.
      formData.append("adjuntos", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "application/octet-stream",
      });
    }

    const { data: res } = await rfqApi.create(formData);
    return res.rfq;
  },

  submitCotizacion: async (
    rfqId: string,
    data: {
      precioUnitario?: string;
      precioTotal?: string;
      plazoEntrega?: string;
      condicionesPago?: string;
      observaciones?: string;
    },
  ): Promise<Cotizacion> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const { data: res } = await rfqApi.submitCotizacion(rfqId, formData);
    return res.cotizacion;
  },
};
