'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api/referrals.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { PageHeader } from '@/components/common/page-header';
import { ReferralCard } from '@/components/referrals/referral-card';
import { BonusSlotsDisplay } from '@/components/referrals/bonus-slots-display';
import { ReferralStatsTable } from '@/components/referrals/referral-stats';

export default function ReferralsPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.referrals.stats(),
    queryFn: referralsApi.getStats,
  });

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Referral Programme" subtitle="Share DriveStack and earn bonus account slots" />

      <div className="mt-6 space-y-6">
        <ReferralCard />
        <BonusSlotsDisplay bonusSlots={data?.bonusSlots ?? 0} />
        <ReferralStatsTable referrals={data?.referrals ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
