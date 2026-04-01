import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sha8alny-backend-857164936517.us-central1.run.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: any) => {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/Auth/me');
    return response.data;
  },
  forgotPassword: async (data: any) => {
    const response = await api.post('/Auth/forgot-password', data);
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await api.post('/Auth/reset-password', data);
    return response.data;
  }
};

export interface CompanyProfilePayload {
  companyName?: string;
  description?: string;
  industry?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

export const companiesApi = {
  getProfile: async () => {
    const response = await api.get('/companies/profile');
    return response.data?.data;
  },
  createProfile: async (data: CompanyProfilePayload) => {
    const response = await api.post('/companies/profile', data);
    return response.data;
  },
  updateProfile: async (data: CompanyProfilePayload) => {
    const response = await api.put('/companies/profile', data);
    return response.data;
  }
};

export default api;
