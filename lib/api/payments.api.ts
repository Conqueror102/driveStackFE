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
    apiFetch<{ checkoutUrl: string }>('/api/payments/checkout', {
      method: 'POST',
      body: dto,
    }),

  cancel: () =>
    apiFetch('/api/payments/cancel', {
      method: 'POST',
    }),

  getPortalUrl: () =>
    apiFetch<{ url: string }>('/api/payments/portal', {
      method: 'GET',
    }),

  getStatus: () =>
    apiFetch<SubscriptionStatusResponse>('/api/payments/status', {
      method: 'GET',
    }),

  getPricing: () =>
    apiFetch<PricingResponse>('/api/payments/pricing', {
      method: 'GET',
    }),
};
