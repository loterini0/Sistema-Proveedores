import { mockCompany, Company } from "./mock.data";
import { api } from "./api";

const USE_MOKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export interface ComponaySearchParams {
  query?: string;
  category?: string;
  city?: string;
}

export const companyService = {
  search: async (params?: ComponaySearchParams): Promise<Company[]> => {
    if (USE_MOKS) {
      let resul = mockCompany;

      if (params?.query) {
        const q = params.query.toLowerCase();
        resul = resul.filter((e) => e.name.toLowerCase().includes(q));
      }

      if (params?.category) {
        resul = resul.filter((e) => e.category === params.category);
      }

      if (params?.city) {
        resul = resul.filter((e) => e.city === params.city);
      }

      return resul;
    }

    const { data } = await api.get(`company/search`, { params });
    return data;
  },

  get: async (id: string): Promise<Company | undefined> => {
    if (USE_MOKS) {
      return mockCompany.find((e) => e.id === id);
    }

    const { data } = await api.get(`/company/${id}`);
    return data;
  },
};
