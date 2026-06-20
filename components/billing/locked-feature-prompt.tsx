'use client';

import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProBadge } from './pro-badge';
import { useUpgradeModal } from './upgrade-modal-context';
import { useAuthStore } from '@/stores/auth.store';
import { usePricing } from '@/hooks/use-pricing';
import type { ProFeature } from '@/stores/subscription.store';

const FEATURE_META: Record<ProFeature, { title: string; description: string }> = {
  move_files: {
    title: 'Move Files',
    description: 'Move files between your Google accounts instantly — no downloading, no re-uploading.',
  },
  duplicate_detector: {
    title: 'Duplicate Detector',
    description: 'Find identical files across all your accounts and free up storage with one click.',
  },
  bulk_operations: {
    title: 'Bulk Operations',
    description: 'Select, delete, and move multiple files at once across all accounts.',
  },
  storage_alerts: {
    title: 'Storage Alerts',
    description: 'Get notified when any connected account is running low on storage.',
  },
  storage_history: {
    title: 'Storage History',
    description: 'View your storage usage over time with interactive charts.',
  },
  upload_from_url: {
    title: 'Upload from URL',
    description: 'Paste a link and upload files directly to your Google Drive.',
  },
  file_preview: {
    title: 'File Preview',
    description: 'Preview documents, images, and videos without leaving DriveStack.',
  },
  connect_account_above_limit: {
    title: 'Unlimited Accounts',
    description: 'Connect more than 2 Google accounts and manage them all in one place.',
  },
};

interface LockedFeaturePromptProps {
  feature: ProFeature;
  title?: string;
  description?: string;
}

export function LockedFeaturePrompt({ feature, title, description }: LockedFeaturePromptProps) {
  const meta = FEATURE_META[feature];
  const { openUpgradeModal } = useUpgradeModal();
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

  return (
    <div className="flex flex-col items-center justify-center text-center border border-border rounded-xl bg-white p-10 max-w-lg mx-auto">
      <Lock className="h-8 w-8 text-text-tertiary mb-4" />
      <h3 className="text-[20px] font-semibold text-text-primary mb-2">{title || meta.title}</h3>
      <ProBadge className="mb-4" />
      <p className="text-[14px] text-text-secondary mb-6 leading-relaxed max-w-xs">
        {description || meta.description}
      </p>
      <Button
        className="w-full max-w-xs bg-text-primary text-white hover:bg-text-primary/90"
        onClick={() => openUpgradeModal(feature)}
      >
        {isPricingLoading ? (
          <span className="flex items-center">
            Upgrade to Pro — <span className="ml-1 inline-block h-4 w-12 bg-white/20 animate-pulse rounded"></span>/month
          </span>
        ) : (
          `Upgrade to Pro — ${formattedPrice}/month`
        )}
      </Button>
    </div>
  );
}
