'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { paymentsApi } from '@/lib/api/payments.api';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelSubscriptionDialog({ open, onOpenChange }: CancelSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false);
  const { currentPeriodEnd, setSubscription, plan, status, gracePeriodEndsAt } = useSubscriptionStore();

  const handleCancel = async () => {
    setLoading(true);
    try {
      await paymentsApi.cancel();
      setSubscription({ plan, status: 'CANCELLED', currentPeriodEnd, gracePeriodEndsAt });
      toast.success(`Subscription cancelled. You keep Pro access until ${currentPeriodEnd ? format(new Date(currentPeriodEnd), 'MMMM d, yyyy') : 'the end of your billing period'}.`);
      onOpenChange(false);
    } catch {
      toast.error('Failed to cancel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel your subscription?</DialogTitle>
          <DialogDescription>This action can be reversed — you can resubscribe anytime.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 text-[14px] text-text-secondary">
          {currentPeriodEnd && (
            <p>You'll keep Pro access until <span className="font-medium text-text-primary">{format(new Date(currentPeriodEnd), 'MMMM d, yyyy')}</span>. After that your account reverts to Free.</p>
          )}
          <p>Your connected accounts stay connected.</p>
          <p>Your files are never deleted.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Keep my subscription</Button>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Cancel subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
