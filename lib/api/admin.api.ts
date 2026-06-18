import axios from 'axios';
import { useAdminStore } from '@/stores/admin.store';

export const adminRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

adminRequest.interceptors.request.use((config) => {
  const token = useAdminStore.getState().adminToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuditLogParams {
  email?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}

export interface UpdatePricingDto {
  productId: string;
  amount: number;
  interval: 'month' | 'year';
  active: boolean;
  currency: string;
}

export const adminApi = {
  auth: (password: string) =>
    adminRequest.post<{ adminToken: string }>('/admin/auth', { password }).then((r) => r.data),

  getAuditLog: (params?: AuditLogParams) =>
    adminRequest.get('/admin/audit-log', { params }).then((r) => r.data),

  getRevenue: () =>
    adminRequest.get('/admin/revenue').then((r) => r.data),

  getUsers: (params?: any) =>
    adminRequest.get('/admin/users', { params }).then((r) => r.data),

  manualUpgrade: (userId: string, note: string) =>
    adminRequest.post(`/admin/users/${userId}/upgrade`, { note }).then((r) => r.data),

  updatePricing: (dto: UpdatePricingDto) =>
    adminRequest.put('/admin/pricing', dto).then((r) => r.data),
};
