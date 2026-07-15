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

    const { data } = await rfqApi.list(
      params
        ? {
            estado: params.status,
          }
        : undefined,
    );
    return data;
  },

  get: async (id: string): Promise<Rfq | undefined> => {
    if (USE_MOCKS) {
      return mockRfqs.find((r) => r.id === id);
    }

    const { data } = await rfqApi.get(id);
    return data;
  },

  getCotizaciones: async (rfqId: string): Promise<Cotizacion[]> => {
    if (USE_MOCKS) {
      return mockCotizaciones.filter((c) => c.rfqId === rfqId);
    }

    const { data } = await rfqApi.getCotizaciones(rfqId);
    return data;
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
};
