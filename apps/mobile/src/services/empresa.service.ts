import { mockEmpresas, mockProductos, Empresa, Producto } from "./mock.data";
import { empresaService as empresaApi, productoService as productoApi } from "./api";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export interface EmpresaSearchParams {
  q?: string;
  categoriaId?: string; // antes: sector
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
      if (params?.categoriaId) {
        resultado = resultado.filter((e) => e.categoriaId === params.categoriaId);
      }
      if (params?.departamento) {
        resultado = resultado.filter(
          (e) => e.departamento === params.departamento,
        );
      }

      return resultado;
    }

    // El backend responde { data: [...], total, page, limit }
    const { data } = await empresaApi.search(params ?? {});
    return data.data;
  },

  get: async (id: string): Promise<Empresa | undefined> => {
    if (USE_MOCKS) {
      return mockEmpresas.find((e) => e.id === id);
    }

    // El backend responde { data: {...} }
    const { data } = await empresaApi.get(id);
    return data.data;
  },

  getProductos: async (id: string): Promise<Producto[]> => {
    if (USE_MOCKS) {
      return mockProductos.filter((p) => p.empresaId === id);
    }

    // El backend responde { productos: [...] }
    const { data } = await empresaApi.getProductos(id);
    return data.productos;
  },

  create: async (payload: {
    razonSocial: string;
    categoriaId: string;
    nit?: string;
    descripcion?: string;
    ciudad?: string;
    departamento?: string;
    telefono?: string;
    website?: string;
  }): Promise<Empresa> => {
    // Registrar tu empresa siempre pega contra la API real.
    const { data } = await empresaApi.create(payload);
    return data.empresa;
  },

  update: async (
    id: string,
    payload: Partial<{
      razonSocial: string;
      categoriaId: string;
      nit: string;
      descripcion: string;
      ciudad: string;
      departamento: string;
      telefono: string;
      website: string;
    }>,
  ): Promise<Empresa> => {
    const { data } = await empresaApi.update(id, payload);
    return data.empresa;
  },

  createProducto: async (
    empresaId: string,
    payload: {
      nombre: string;
      descripcion?: string;
      precio?: string;
      categoriaId?: string;
      imagenUrl?: string;
    },
  ) => {
    const { data } = await productoApi.create(empresaId, payload);
    return data.producto;
  },

  updateProducto: async (
    empresaId: string,
    productoId: string,
    payload: Partial<{
      nombre: string;
      descripcion: string;
      precio: string;
      categoriaId: string;
      imagenUrl: string;
    }>,
  ) => {
    const { data } = await productoApi.update(empresaId, productoId, payload);
    return data.producto;
  },

  deleteProducto: async (empresaId: string, productoId: string) => {
    await productoApi.remove(empresaId, productoId);
  },
};
