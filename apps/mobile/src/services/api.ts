import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: (data: { email: string; password: string; nombre: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  me: () => api.get("/auth/me"),
};

export const empresaService = {
  search: (params: {
    q?: string;
    categoriaId?: string; // antes: sector
    departamento?: string;
    page?: number;
  }) => api.get("/empresas/search", { params }),
  // ... resto igual
};

export const rfqService = {
  create: (formData: FormData) =>
    api.post("/rfq", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  list: (params?: { estado?: string; soloMias?: boolean; page?: number; limit?: number }) =>
    api.get("/rfq", { params }),

  get: (id: string) => api.get(`/rfq/${id}`),
  submitCotizacion: (rfqId: string, formData: FormData) =>
    api.post(`/rfq/${rfqId}/cotizaciones`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getCotizaciones: (rfqId: string) => api.get(`/rfq/${rfqId}/cotizaciones`),
};

export const categoriaService = {
  listar: () => api.get("/categorias"),
};
