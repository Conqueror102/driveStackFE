"use client";

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.admin.revenue(),
    queryFn: adminApi.getRevenue,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Overview</h1>
        <p className="text-zinc-500 mt-1">High-level metrics and revenue summary.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Active Pro users" value={data?.activeProUsers ?? 0} />
          <StatCard title="Total revenue" value={`₦${(data?.totalRevenue ?? 0).toLocaleString()}`} />
          <StatCard title="Refunds" value={`₦${(data?.refunds ?? 0).toLocaleString()}`} />
          <StatCard title="Disputes" value={data?.disputes ?? 0} />
        </div>
      )}

      {/* Placeholder for line chart */}
      <div className="border border-zinc-200 rounded-xl p-6 bg-white shadow-sm mt-8 h-96 flex items-center justify-center">
        <p className="text-zinc-400">Daily new Pro subscribers chart (last 30 days)</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="text-3xl font-bold text-zinc-900 mt-2">{value}</p>
    </div>
  );
}
