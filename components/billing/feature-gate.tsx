'use client';

import type { ProFeature } from '@/stores/subscription.store';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { LockedFeaturePrompt } from './locked-feature-prompt';

interface FeatureGateProps {
  feature: ProFeature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const canAccess = useSubscriptionStore((state) => state.canAccess);

  if (canAccess(feature)) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return <LockedFeaturePrompt feature={feature} />;
}
