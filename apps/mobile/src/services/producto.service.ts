import { api } from './api';

export const productoService = {
  recientes: async () => {
    const { data } = await api.get('/productos/recientes');
    return data.data;
  },

  get: async (id: string) => {
    const { data } = await api.get(`/productos/${id}`);
    return data.data;
  },

  getByEmpresa: async (empresaId: string) => {
    try {
      const res = await api.get(`/empresas/${empresaId}/productos`);
      return res.data?.productos ?? [];
    } catch {
      return [];
    }
  },
};