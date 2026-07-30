import { mockCategorias, Categoria } from "./mock.data";
import { categoriaService as categoriaApi } from "./api";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export const categoriaService = {
  listar: async (): Promise<Categoria[]> => {
    if (USE_MOCKS) {
      return mockCategorias.filter((c) => c.activo);
    }

    const { data } = await categoriaApi.listar();
    return data;
  },
};