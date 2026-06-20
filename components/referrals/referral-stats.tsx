'use client';

import { cn } from '@/lib/utils';

interface Referral {
  email: string;
  status: 'Pending' | 'Converted' | 'Expired';
  date: string;
}

interface ReferralStatsTableProps {
  referrals: Referral[];
  isLoading: boolean;
}

export function ReferralStatsTable({ referrals = [], isLoading }: ReferralStatsTableProps) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-semibold text-text-primary">Your referrals</h3>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-[13px] text-text-secondary">Loading referrals...</div>
      ) : referrals.length === 0 ? (
        <div className="p-6 text-center text-[13px] text-text-secondary">
          No referrals yet. Share your link to get started!
        </div>
      ) : (
        <div className="divide-y divide-border">
          {referrals.map((ref, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="text-[14px] text-text-primary font-mono truncate">{ref.email}</span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0',
                    ref.status === 'Converted' && 'bg-green-100 text-green-700',
                    ref.status === 'Pending' && 'bg-zinc-100 text-zinc-600',
                    ref.status === 'Expired' && 'bg-zinc-50 text-text-tertiary',
                  )}
                >
                  {ref.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-text-secondary shrink-0">
                <span>{new Date(ref.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                <span className="w-20 text-right">
                  {ref.status === 'Converted' ? (
                    <span className="text-green-600 font-medium">+1 slot ✓</span>
                  ) : ref.status === 'Pending' ? (
                    <span className="text-text-tertiary">waiting...</span>
                  ) : (
                    <span className="text-text-tertiary">—</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
