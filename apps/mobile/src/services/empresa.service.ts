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

    const { data } = await empresaApi.search(params ?? {});
    return data;
  },
  // ... get y getProductos sin cambios
};
