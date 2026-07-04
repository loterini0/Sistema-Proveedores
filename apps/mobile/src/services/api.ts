import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Adjuntar JWT en cada request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejar token expirado
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authService = {
  register: (data: { email: string; password: string; nombre: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  me: () => api.get('/auth/me'),
};

// ── Empresas ─────────────────────────────────────────────
export const empresaService = {
  search: (params: { q?: string; sector?: string; departamento?: string; page?: number }) =>
    api.get('/empresas/search', { params }),
  get: (id: string) => api.get(`/empresas/${id}`),
  create: (data: any) => api.post('/empresas', data),
  update: (id: string, data: any) => api.put(`/empresas/${id}`, data),
  getProductos: (id: string) => api.get(`/empresas/${id}/productos`),
  createProducto: (id: string, data: any) => api.post(`/empresas/${id}/productos`, data),
};

// ── RFQ ──────────────────────────────────────────────────
export const rfqService = {
  create: (formData: FormData) =>
    api.post('/rfq', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  list: (params?: { estado?: string }) => api.get('/rfq', { params }),
  get: (id: string) => api.get(`/rfq/${id}`),
  submitCotizacion: (rfqId: string, formData: FormData) =>
    api.post(`/rfq/${rfqId}/cotizaciones`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getCotizaciones: (rfqId: string) => api.get(`/rfq/${rfqId}/cotizaciones`),
};
