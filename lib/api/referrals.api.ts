import { apiFetch } from './client';

export interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  bonusSlots: number;
  referrals: Array<{
    email: string;
    status: 'Pending' | 'Converted' | 'Expired';
    date: string;
  }>;
}

export const referralsApi = {
  getStats: () =>
    apiFetch<ReferralStats>('/api/referrals/stats', {
      method: 'GET',
    }),
};
