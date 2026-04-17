import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sha8alny-backend-857164936517.us-central1.run.app/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/Auth/login", { email, password });
    return res.data;
  },
  register: async (email: string, password: string, role = "company") => {
    const res = await api.post("/Auth/register", { email, password, role });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/Auth/me");
    // Backend may return { data: {...} } or the object directly
    return res.data?.data ?? res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post("/Auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const res = await api.post("/Auth/reset-password", { token, newPassword });
    return res.data;
  },
};

// ─── Company Profile ──────────────────────────────────────────────────────────
export interface CompanyProfilePayload {
  companyName?: string;
  description?: string;
  industry?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

export const companiesApi = {
  getProfile: async () => {
    const res = await api.get("/companies/profile");
    return res.data?.data ?? res.data;
  },
  createProfile: async (data: CompanyProfilePayload) => {
    const res = await api.post("/companies/profile", data);
    return res.data?.data ?? res.data;
  },
  updateProfile: async (data: CompanyProfilePayload) => {
    const res = await api.put("/companies/profile", data);
    return res.data?.data ?? res.data;
  },
};

export default api;
