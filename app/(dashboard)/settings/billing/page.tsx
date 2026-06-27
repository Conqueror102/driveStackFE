'use client';

import { useState } from 'react';
import { BillingStatusCard } from '@/components/billing/billing-status-card';
import { CancelSubscriptionDialog } from '@/components/billing/cancel-subscription-dialog';
import { FeatureComparison } from '@/components/billing/feature-comparison';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { Button } from '@/components/ui/button';
import { paymentsApi } from '@/lib/api/payments.api';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { plan, status, currentPeriodEnd, gracePeriodEndsAt } = useSubscriptionStore();

  const handleResubscribe = async () => {
    try {
      const data = await paymentsApi.createCheckout({});
      window.location.href = data.checkoutUrl;
    } catch {
      // toast handled by checkout
    }
  };

  const handleUpdatePayment = async () => {
    try {
      const data = await paymentsApi.getPortalUrl();
      window.open(data.url, '_blank');
    } catch {
      // silent
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="space-y-6">
        {/* ON_HOLD Banner */}
        {status === 'ON_HOLD' && (
          <div className="border border-[#D97706] bg-[#FFFBEB] rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-[#D97706] text-lg">⚠</span>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-amber-900">Payment failed — update your payment method</p>
                <p className="text-[13px] text-amber-800 mt-1">
                  Your Pro access continues until {gracePeriodEndsAt ? format(new Date(gracePeriodEndsAt), 'MMMM d, yyyy') : 'your grace period ends'}, after which your account will be downgraded.
                </p>
                <Button size="sm" variant="outline" className="mt-3 border-[#D97706] text-amber-900 hover:bg-amber-100" onClick={handleUpdatePayment}>
                  Update payment method →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CANCELLED Banner */}
        {status === 'CANCELLED' && (
          <div className="border border-border bg-surface rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-text-primary">Your subscription is cancelled</p>
                <p className="text-[13px] text-text-secondary mt-1">
                  Pro features remain active until {currentPeriodEnd ? format(new Date(currentPeriodEnd), 'MMMM d, yyyy') : 'the end of your billing period'}.
                </p>
                <Button size="sm" className="mt-3 bg-text-primary text-white hover:bg-text-primary/90" onClick={handleResubscribe}>
                  Resubscribe
                </Button>
              </div>
            </div>
          </div>
        )}

        <BillingStatusCard />

        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-[15px] font-semibold text-text-primary">Plan Features</h2>
            <p className="text-[13px] text-text-secondary mt-1">Everything included in your current plan</p>
          </div>
          <FeatureComparison />
        </div>

        {/* Danger zone — cancel subscription */}
        {plan === 'PRO' && status === 'ACTIVE' && (
          <section className="bg-white border border-border rounded-xl p-6">
            <h3 className="text-[15px] font-semibold text-text-primary mb-1">Cancel subscription</h3>
            <p className="text-[13px] text-text-secondary mb-4">
              You'll keep Pro access until the end of your current billing period. Your files and accounts are never deleted.
            </p>
            <Button variant="outline" onClick={() => setCancelOpen(true)}>Cancel subscription</Button>
          </section>
        )}

        {plan === 'FREE' && (
          <section className="bg-white border border-border rounded-xl p-6 text-center">
            <p className="text-[14px] text-text-secondary mb-4">You're on the Free plan.</p>
            <Link href="/pricing">
              <Button className="bg-text-primary text-white hover:bg-text-primary/90">View pricing</Button>
            </Link>
          </section>
        )}
      </div>

      <CancelSubscriptionDialog open={cancelOpen} onOpenChange={setCancelOpen} />
    </div>
  );
}
