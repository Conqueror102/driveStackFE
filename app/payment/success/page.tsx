'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { paymentsApi } from '@/lib/api/payments.api';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { toast } from 'sonner';

function AnimatedCheckmark() {
  return (
    <svg className="w-24 h-24 mx-auto" viewBox="0 0 96 96" fill="none">
      <circle
        cx="48" cy="48" r="44"
        stroke="#10B981"
        strokeWidth="4"
        className="animate-[draw-circle_0.6s_ease-out_forwards]"
        style={{
          strokeDasharray: 276,
          strokeDashoffset: 276,
          animation: 'draw-circle 0.6s ease-out forwards',
        }}
      />
      <path
        d="M30 50 L42 62 L66 38"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 60,
          strokeDashoffset: 60,
          animation: 'draw-check 0.4s ease-out 0.5s forwards',
        }}
      />
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

export default function PaymentSuccessPage() {
  const setSubscription = useSubscriptionStore((state) => state.setSubscription);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await paymentsApi.getStatus();
        setSubscription({
          plan: status.plan,
          status: status.status,
          currentPeriodEnd: status.currentPeriodEnd,
          gracePeriodEndsAt: status.gracePeriodEndsAt,
        });
        toast.success("You're now on Pro! All features unlocked.");
      } catch {
        // silent — status will sync on next auth check
      } finally {
        setLoaded(true);
      }
    };
    fetchStatus();
  }, [setSubscription]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm text-center space-y-6">
        <AnimatedCheckmark />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">You're now on Pro 🎉</h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            All features are unlocked.<br />
            Your subscription starts today.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/files">
            <Button className="bg-text-primary text-white hover:bg-text-primary/90">
              Go to my files →
            </Button>
          </Link>
          <Link href="/settings/billing">
            <Button variant="outline">View billing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
