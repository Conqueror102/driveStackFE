import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments.api';

export function usePricing() {
  return useQuery({
    queryKey: ['payments', 'pricing'],
    queryFn: paymentsApi.getPricing,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
