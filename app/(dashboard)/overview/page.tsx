'use client';

import { useAccounts } from '@/hooks/use-accounts';
import { useStorage } from '@/hooks/use-storage';
import { useFiles } from '@/hooks/use-files';
import { useAuthStore } from '@/stores/auth.store';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { getFileTypeInfo } from '@/lib/utils/file-type';
import { LayoutDashboard, HardDrive, Cloud, TrendingUp, ChevronRight, Upload, Plus, PieChart, BarChartHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUploadStore } from '@/stores/upload.store';
import { useEffect, useState } from 'react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function OverviewPage() {
  const user = useAuthStore((state) => state.user);
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: storage, isLoading: storageLoading } = useStorage();
  const { data: filesData } = useFiles({ sortBy: 'modifiedAt', sortOrder: 'desc', page: 1, limit: 5 });
  const { setIsOpen } = useUploadStore();
  const router = useRouter();
  const [chartView, setChartView] = useState<'donut' | 'linear'>('donut');

  const recentFiles = filesData?.data || [];
  const totalUsed = Number(storage?.totalUsed) || 0;
  const totalLimit = Number(storage?.totalLimit) || 1;
  const totalFree = Number(storage?.totalFree) || Math.max(0, totalLimit - totalUsed);
  const usagePct = Math.min(100, (totalUsed / totalLimit) * 100);

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-1">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-[14px] text-text-secondary">Here's your storage at a glance</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 stagger-children">
        <StatCard
          label="Accounts"
          value={accounts?.length.toString() || '0'}
          sublabel="connected"
          icon={<Cloud className="h-4 w-4" />}
          color="neutral"
        />
        <StatCard
          label="Total Storage"
          value={formatBytes(totalLimit)}
          sublabel="combined"
          icon={<HardDrive className="h-4 w-4" />}
          color="neutral"
        />
        <StatCard
          label="Used"
          value={formatBytes(totalUsed)}
          sublabel={`${Math.round(usagePct)}% of total`}
          icon={<TrendingUp className="h-4 w-4" />}
          color={usagePct > 85 ? 'amber' : 'emerald'}
        />
        <StatCard
          label="Free"
          value={formatBytes(totalFree)}
          sublabel="available"
          icon={<LayoutDashboard className="h-4 w-4" />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Storage Health — Main Card */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-border p-6 card-hover">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[15px] font-semibold text-text-primary">Storage Health</h2>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-text-tertiary font-mono tabular-nums hidden sm:inline-block">
                  {formatBytes(totalUsed)} / {formatBytes(totalLimit)}
                </span>
                <div className="flex items-center border border-border rounded-lg bg-surface p-0.5 h-8">
                  <button
                    onClick={() => setChartView('donut')}
                    className={`p-1.5 rounded-md transition-all duration-150 ${chartView === 'donut' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                    aria-label="Donut view"
                  >
                    <PieChart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChartView('linear')}
                    className={`p-1.5 rounded-md transition-all duration-150 ${chartView === 'linear' ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
                    aria-label="Linear view"
                  >
                    <BarChartHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {chartView === 'donut' ? (
              <div className="animate-fade-in-up">
                {/* Donut Chart */}
                <div className="flex items-center justify-center mb-6">
                  <StorageDonut accounts={accounts || []} totalLimit={totalLimit} totalUsed={totalUsed} />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(accounts || []).map((acc: any) => {
                    const used = Number(acc.storageUsed) || 0;
                    const limit = Number(acc.storageLimit) || 1;
                    return (
                      <div key={acc.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: acc.colorInfo.dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-text-primary truncate">{acc.googleEmail.split('@')[0]}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[12px] font-mono tabular-nums text-text-secondary">{formatBytes(used)}</span>
                          <span className="text-[11px] text-text-tertiary ml-1 hidden sm:inline">/ {formatBytes(limit)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <StorageLinearBar accounts={accounts || []} totalLimit={totalLimit} totalUsed={totalUsed} />
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="text-[15px] font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-text-primary text-white hover:bg-text-primary/90 transition-all active:scale-[0.98]"
              >
                <Upload className="h-4 w-4" />
                <span className="text-[13px] font-medium">Upload files</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
              </button>
              <button
                onClick={() => router.push('/accounts')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-surface transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4 text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Connect account</span>
                <ChevronRight className="h-4 w-4 ml-auto text-text-tertiary" />
              </button>
            </div>
          </div>

          {/* Account Health */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-text-primary">Account Health</h2>
              <Link href="/accounts" className="text-[12px] text-accent hover:text-accent-hover font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {(accounts || []).map((acc: any) => {
                const used = Number(acc.storageUsed) || 0;
                const limit = Number(acc.storageLimit) || 1;
                const pct = Math.round((used / limit) * 100);
                const isHigh = pct >= 85;

                return (
                  <div key={acc.id} className="flex items-center gap-3">
                    <AccountGauge pct={pct} color={acc.colorInfo.dot} isHigh={isHigh} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-text-primary truncate">{acc.googleEmail.split('@')[0]}</div>
                      <div className="text-[11px] text-text-tertiary">{formatBytes(limit - used)} free</div>
                    </div>
                    {isHigh && (
                      <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {pct}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="mt-6 bg-white rounded-xl border border-border p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-text-primary">Recent Files</h2>
          <Link href="/files" className="text-[12px] text-accent hover:text-accent-hover font-medium flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        {recentFiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-text-tertiary">No files yet. Upload your first file to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentFiles.map((file: any) => {
              const info = getFileTypeInfo(file.mimeType);
              return (
                <div key={file.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <info.icon className="w-4 h-4" style={{ color: info.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-primary truncate">{file.name}</p>
                    <p className="text-[11px] text-text-tertiary">
                      {file.account.googleEmail.split('@')[0]} · {formatBytes(file.sizeBytes)}
                    </p>
                  </div>
                  <span className="text-[11px] text-text-tertiary shrink-0 hidden sm:block">
                    {formatRelative(file.driveModifiedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function StatCard({ label, value, sublabel, icon, color }: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
  color: 'blue' | 'violet' | 'emerald' | 'amber' | 'neutral';
}) {
  const colorMap = {
    blue: 'from-blue-500/10 to-blue-500/5 text-blue-600',
    violet: 'from-violet-500/10 to-violet-500/5 text-violet-600',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-600',
    neutral: 'from-black/10 to-black/5 text-black',
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium text-text-secondary">{label}</span>
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-[22px] font-semibold text-text-primary tracking-tight font-mono tabular-nums animate-count-up">
        {value}
      </div>
      <div className="text-[11px] text-text-tertiary mt-0.5">{sublabel}</div>
    </div>
  );
}

function StorageDonut({ accounts, totalLimit, totalUsed }: {
  accounts: any[];
  totalLimit: number;
  totalUsed: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const usagePct = Math.min(100, (totalUsed / totalLimit) * 100);

  // Calculate segment arcs
  let currentOffset = 0;
  const segments = accounts.map((acc: any) => {
    const used = Number(acc.storageUsed) || 0;
    const pct = (used / totalLimit) * 100;
    const segment = {
      pct,
      offset: currentOffset,
      dashArray: `${(pct / 100) * circumference} ${circumference}`,
      dashOffset: -((currentOffset / 100) * circumference),
      color: acc.colorInfo.dot,
    };
    currentOffset += pct;
    return segment;
  });

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Segments */}
        {mounted && segments.map((seg, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth - 2}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="butt"
            className="transition-all duration-700"
            style={{ opacity: mounted ? 1 : 0 }}
          />
        ))}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-text-primary font-mono tabular-nums">
          {Math.round(usagePct)}%
        </span>
        <span className="text-[11px] text-text-tertiary">used</span>
      </div>
    </div>
  );
}

function AccountGauge({ pct, color, isHigh }: { pct: number; color: string; isHigh: boolean }) {
  const size = 36;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={isHigh ? '#FBBF24' : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-semibold text-text-primary font-mono">{pct}%</span>
      </div>
    </div>
  );
}

function StorageLinearBar({ accounts, totalLimit, totalUsed }: {
  accounts: any[];
  totalLimit: number;
  totalUsed: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalFree = Math.max(0, totalLimit - totalUsed);
  const totalFreePct = Math.min(100, (totalFree / totalLimit) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[26px] font-semibold text-text-primary tracking-tight font-mono tabular-nums">{formatBytes(totalUsed, 1).split(' ')[0]}</span>
            <span className="text-[20px] font-semibold text-text-primary tracking-tight font-mono">{formatBytes(totalUsed, 1).split(' ')[1]}</span>
            <span className="text-[15px] text-text-secondary ml-1">used of {formatBytes(totalLimit, 0)}</span>
          </div>
          <p className="text-[13px] text-text-tertiary">Combined storage across {accounts.length} connected account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-1.5 sm:justify-end mb-1">
            <span className="text-[18px] font-semibold text-text-primary tracking-tight font-mono tabular-nums">{formatBytes(totalFree, 1)}</span>
            <span className="text-[15px] text-text-primary">free</span>
          </div>
          <p className="text-[13px] text-text-tertiary">Available for new uploads</p>
        </div>
      </div>

      <div className="h-4 w-full bg-surface rounded-full overflow-hidden flex gap-0.5">
        {accounts.map((acc: any) => {
          const used = Number(acc.storageUsed) || 0;
          const pct = (used / totalLimit) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={acc.id}
              className="h-full first:rounded-l-full transition-all duration-700"
              style={{ width: mounted ? `${pct}%` : '0%', backgroundColor: acc.colorInfo.dot }}
              title={`${acc.googleEmail}: ${formatBytes(used)}`}
            />
          );
        })}
        {/* The free space is essentially the remaining width of the background, but we don't need a div for it since the container has background */}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-2">
        {accounts.map((acc: any) => {
          const used = Number(acc.storageUsed) || 0;
          return (
            <div key={acc.id} className="flex items-start gap-2 max-w-[180px]">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: acc.colorInfo.dot }} />
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] text-text-primary truncate">{acc.googleEmail}</span>
                <span className="text-[12px] font-mono tabular-nums text-text-tertiary">{formatBytes(used, 1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
