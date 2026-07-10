import { mockRfqs, mockContribution, Rfq, Contribution } from "./mock.data";
import { api } from "./api";

const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === "true";

export interface RfqSearchParams {
  state?: Rfq["state"];
  applicantCompanyId?: string;
}

export const rfqService = {
  search: async (params?: RfqSearchParams): Promise<Rfq[]> => {
    if (USE_MOCKS) {
      let resul = mockRfqs;

      if (params?.state) {
        resul = resul.filter((r) => r.state === params.state);
      }

      if (params?.applicantCompanyId) {
        resul = resul.filter(
          (r) => r.applicantCompanyId === params.applicantCompanyId,
        );
      }
      return resul;
    }

    const { data } = await api.get("/rfqs/search", { params });
    return data;
  },

  get: async (id: string): Promise<Rfq | undefined> => {
    if (USE_MOCKS) {
      return mockRfqs.find((r) => r.id === id);
    }

    const { data } = await api.get(`/rfqs/${id}`);
    return data;
  },

  getContribution: async (rfqId: string): Promise<Contribution[]> => {
    if (USE_MOCKS) {
      return mockContribution.filter((c) => c.rfqId === rfqId);
    }

    const { data } = await api.get(`/rfqs/${rfqId}/contribution`);
    return data;
  },
};
