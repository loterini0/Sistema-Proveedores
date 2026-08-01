import { api } from './api';

export const productoService = {
  recientes: async () => {
    try {
      const res = await api.get('/empresas/search', { params: { limit: 6 } });
      const empresas = res.data?.data ?? [];
      const productos: any[] = [];
      empresas.forEach((e: any) => {
        if (e.productos) {
          e.productos.forEach((p: any) => {
            productos.push({ ...p, empresaNombre: e.razonSocial, empresaId: e.id });
          });
        }
      });
      return productos;
    } catch {
      return [];
    }
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
