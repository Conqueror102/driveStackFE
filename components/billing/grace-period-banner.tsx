'use client';

import { useState } from 'react';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { paymentsApi } from '@/lib/api/payments.api';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';

export function GracePeriodBanner() {
  const { status, gracePeriodEndsAt } = useSubscriptionStore();
  const [dismissed, setDismissed] = useState(false);

  if (status !== 'ON_HOLD' || dismissed) return null;

  const handleUpdatePayment = async () => {
    try {
      const data = await paymentsApi.getPortalUrl();
      window.open(data.url, '_blank');
    } catch {
      // silent
    }
  };

  return (
    <div className="w-full bg-[#FFFBEB] border-b border-[#D97706] px-4 py-3 flex items-center justify-between gap-4 z-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <AlertTriangle className="h-4 w-4 text-[#D97706] shrink-0" />
        <div className="text-[13px] text-amber-900">
          <span className="font-medium">Payment failed.</span>{' '}
          Update your payment method to keep Pro access.
          {gracePeriodEndsAt && (
            <span className="text-amber-700 ml-1">
              Access expires {format(new Date(gracePeriodEndsAt), 'MMMM d, yyyy')}.
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" className="text-[12px] border-[#D97706] text-amber-900 hover:bg-amber-100" onClick={handleUpdatePayment}>
          Update payment method
        </Button>
        <button onClick={() => setDismissed(true)} className="p-1 hover:bg-amber-200/50 rounded transition-colors" aria-label="Dismiss">
          <X className="h-3.5 w-3.5 text-amber-700" />
        </button>
      </div>
    </div>
  );
}
