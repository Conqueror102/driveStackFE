'use client';

import { PageHeader } from '@/components/common/page-header';
import { StorageOverviewCard, AccountQuotaList, StatsStrip } from '@/components/dashboard/storage-overview-card';

export default function StoragePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Storage" subtitle="Quota breakdown across all accounts" />
      <StatsStrip />
      <StorageOverviewCard />
      <AccountQuotaList />
    </div>
  );
}
