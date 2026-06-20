'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api/referrals.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { ReferralCard } from '@/components/referrals/referral-card';
import { BonusSlotsDisplay } from '@/components/referrals/bonus-slots-display';
import { ReferralStatsTable } from '@/components/referrals/referral-stats';

export default function ReferralsPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.referrals.stats(),
    queryFn: referralsApi.getStats,
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReferralCard />
        <BonusSlotsDisplay stats={data} isLoading={isLoading} />
      </div>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-[15px] font-semibold text-text-primary">Your Referrals</h2>
          <p className="text-[13px] text-text-secondary mt-1">Track the status of your invites</p>
        </div>
        <ReferralStatsTable stats={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
