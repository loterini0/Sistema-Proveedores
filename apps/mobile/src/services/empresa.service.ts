import { mockEmpresas, mockProductos, Empresa, Producto } from "./mock.data";
import { empresaService as empresaApi } from "./api";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export interface EmpresaSearchParams {
  q?: string;
  sector?: string;
  departamento?: string;
  page?: number;
}

export const empresaService = {
  search: async (params?: EmpresaSearchParams): Promise<Empresa[]> => {
    if (USE_MOCKS) {
      let resultado = mockEmpresas;

      if (params?.q) {
        const q = params.q.toLowerCase();
        resultado = resultado.filter((e) =>
          e.razonSocial.toLowerCase().includes(q),
        );
      }
      if (params?.sector) {
        resultado = resultado.filter((e) => e.sector === params.sector);
      }
      if (params?.departamento) {
        resultado = resultado.filter(
          (e) => e.departamento === params.departamento,
        );
      }

      return resultado;
    }

    const { data } = await empresaApi.search(params ?? {});
    return data;
  },

  get: async (id: string): Promise<Empresa | undefined> => {
    if (USE_MOCKS) {
      return mockEmpresas.find((e) => e.id === id);
    }

    const { data } = await empresaApi.get(id);
    return data;
  },

  getProductos: async (id: string): Promise<Producto[]> => {
    if (USE_MOCKS) {
      return mockProductos.filter((p) => p.empresaId === id);
    }

    const { data } = await empresaApi.getProductos(id);
    return data;
  },
};
