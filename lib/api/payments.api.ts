import { apiFetch } from './client';

export interface CheckoutDto {
  currency: string;
}

export interface PricingPlan {
  key: string;
  amount: number;
  currency: string;
  interval: string;
  isActive: boolean;
}

export interface PricingResponse {
  plans: PricingPlan[];
}

export interface SubscriptionStatusResponse {
  plan: 'FREE' | 'PRO';
  status: 'ACTIVE' | 'ON_HOLD' | 'CANCELLED' | 'EXPIRED';
  currentPeriodEnd: string | null;
  gracePeriodEndsAt: string | null;
}

export const paymentsApi = {
  createCheckout: (dto: CheckoutDto) =>
    apiFetch<{ checkoutUrl: string }>('/api/backend/payments/checkout', {
      method: 'POST',
      body: dto,
    }),

  cancel: () =>
    apiFetch('/api/backend/payments/cancel', {
      method: 'POST',
    }),

  getPortalUrl: () =>
    apiFetch<{ url: string }>('/api/backend/payments/portal', {
      method: 'GET',
    }),

  getStatus: () =>
    apiFetch<SubscriptionStatusResponse>('/api/backend/payments/status', {
      method: 'GET',
    }),

  getPricing: () =>
    apiFetch<PricingResponse>('/api/payments/pricing', {
      method: 'GET',
    }),
};
