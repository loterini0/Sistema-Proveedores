import axios from "axios";
import { storage } from "../utils/storage";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.deleteItem("accessToken");
      await storage.deleteItem("refreshToken");
    }
    return Promise.reject(error);
  },
);

export const authService = {
  register: (data: { email: string; password: string; nombre: string }) =>
    api.post<RegisterResponse>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>("/auth/login", data),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  me: () => api.get("/auth/me"),
};

export function getApiErrorMessage(error: unknown, fallback: string){
  if (!axios.isAxiosError<ApiErrorResponse>(error)){
    return fallback;
  }

  return error.response?.data.error ?? error.response?.data.message ?? fallback;
}

export const empresaService = {
  search: (params: {
    q?: string;
    categoriaId?: string; // antes: sector
    departamento?: string;
    page?: number;
  }) => api.get("/empresas/search", { params }),
  get: (id: string) => api.get(`/empresas/${id}`),
  create: (data: unknown) => api.post("/empresas", data),
  update: (id: string, data: unknown) => api.put(`/empresas/${id}`, data),
  getProductos: (id: string) => api.get(`/empresas/${id}/productos`),
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

export const productoService = {
  create: (empresaId: string, data: unknown) =>
    api.post(`/empresas/${empresaId}/productos`, data),
  update: (empresaId: string, productoId: string, data: unknown) =>
    api.put(`/empresas/${empresaId}/productos/${productoId}`, data),
  remove: (empresaId: string, productoId: string) =>
    api.delete(`/empresas/${empresaId}/productos/${productoId}`),
};


export interface AuthUser{
  id: string;
  email: string;
  nombre: string;
  empresaId: string | null;
}

export interface LoginResponse{
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterResponse{
  message: string;
  userId: string;
}

interface ApiErrorResponse{
  error?: string;
  message?: string;
}