'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUpgradeModal } from './upgrade-modal-context';
import { paymentsApi } from '@/lib/api/payments.api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { ProFeature } from '@/stores/subscription.store';
import { usePricing } from '@/hooks/use-pricing';

const FEATURE_TITLES: Record<ProFeature, string> = {
  move_files: 'Unlock Move Files',
  duplicate_detector: 'Unlock Duplicate Detector',
  bulk_operations: 'Unlock Bulk Operations',
  storage_alerts: 'Unlock Storage Alerts',
  storage_history: 'Unlock Storage History',
  upload_from_url: 'Unlock Upload from URL',
  file_preview: 'Unlock File Preview',
  connect_account_above_limit: 'Unlock Unlimited Accounts',
};

const FEATURE_DESCRIPTIONS: Record<ProFeature, string> = {
  move_files: 'Move files between your Google accounts instantly — no downloading, no re-uploading.',
  duplicate_detector: 'Find identical files across all your accounts and free up storage with one click.',
  bulk_operations: 'Select, delete, and move multiple files at once across all accounts.',
  storage_alerts: 'Get notified when any connected account is running low on storage.',
  storage_history: 'View your storage usage over time with interactive charts.',
  upload_from_url: 'Paste a link and upload files directly to your Google Drive.',
  file_preview: 'Preview documents, images, and videos without leaving DriveStack.',
  connect_account_above_limit: 'Connect more than 2 Google accounts and manage them all in one place.',
};

export function UpgradeModal() {
  const { isOpen, feature, closeUpgradeModal } = useUpgradeModal();
  const [loading, setLoading] = useState(false);
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

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const data = await paymentsApi.createCheckout({});
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Couldn't start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!feature) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            {FEATURE_TITLES[feature]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <p className="text-[14px] text-text-secondary leading-relaxed">
            {FEATURE_DESCRIPTIONS[feature]}
          </p>

          <div>
            <p className="text-[13px] font-medium text-text-primary mb-3">Everything you get with Pro:</p>
            <ul className="space-y-2 text-[14px] text-text-primary">
              {[
                'Move files between accounts',
                'Duplicate detector',
                'Bulk operations',
                'Storage alerts',
                'Unlimited accounts',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-text-secondary">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[13px] text-text-secondary">
            {isPricingLoading ? (
               <span className="inline-block h-4 w-16 bg-border animate-pulse rounded"></span>
            ) : (
               `${formattedPrice}/month`
            )} · Cancel anytime
          </p>

          <div className="space-y-2">
            <Button
              className="w-full bg-text-primary text-white hover:bg-text-primary/90"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Upgrade to Pro →
            </Button>
            <button
              className="w-full text-center text-[13px] text-text-tertiary hover:text-text-secondary transition-colors py-1"
              onClick={closeUpgradeModal}
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
