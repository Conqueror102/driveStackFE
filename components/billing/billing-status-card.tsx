'use client';

import { useSubscriptionStore } from '@/stores/subscription.store';
import { useAuthStore } from '@/stores/auth.store';
import { usePricing } from '@/hooks/use-pricing';
import { paymentsApi } from '@/lib/api/payments.api';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';

export function BillingStatusCard() {
  const { plan, status, currentPeriodEnd } = useSubscriptionStore();
  const user = useAuthStore((state) => state.user);
  const { data: pricing, isLoading: isPricingLoading } = usePricing();

  const isNg = (user as any)?.country === 'NG';
  const currency = isNg ? 'NGN' : 'USD';
  const activePlan = pricing?.plans?.find(p => p.currency === currency) || { amount: isNg ? 1500 : 2, currency };

  const formatter = new Intl.NumberFormat(isNg ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: isNg ? 0 : 2,
  });

  const formattedPrice = formatter.format(activePlan.amount);

  const handleManageBilling = async () => {
    try {
      const data = await paymentsApi.getPortalUrl();
      window.open(data.url, '_blank');
    } catch {
      // silent
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-text-primary">Current plan</h3>
        {plan === 'PRO' && (
          <Button variant="outline" size="sm" onClick={handleManageBilling} className="gap-2">
            Manage billing <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-3 text-[14px]">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Plan</span>
          <span className="font-medium text-text-primary">{plan === 'PRO' ? 'Pro' : 'Free'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Status</span>
          <span className={`font-medium ${status === 'ACTIVE' ? 'text-green-600' : status === 'ON_HOLD' ? 'text-amber-600' : status === 'CANCELLED' ? 'text-blue-600' : 'text-text-tertiary'}`}>
            {status === 'ACTIVE' ? 'Active' : status === 'ON_HOLD' ? 'Payment failed' : status === 'CANCELLED' ? 'Cancelled' : 'Expired'}
          </span>
        </div>
        {currentPeriodEnd && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Next billing</span>
            <span className="font-medium text-text-primary">{format(new Date(currentPeriodEnd), 'MMMM d, yyyy')}</span>
          </div>
        )}
        {plan === 'PRO' && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Amount</span>
            <span className="font-medium text-text-primary">
              {isPricingLoading ? (
                <div className="h-5 w-20 bg-border animate-pulse rounded inline-block"></div>
              ) : (
                `${formattedPrice}/month`
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
