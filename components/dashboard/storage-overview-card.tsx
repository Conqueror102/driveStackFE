import { useStorage } from '@/hooks/use-storage';
import { useAccounts } from '@/hooks/use-accounts';
import { formatBytes } from '@/lib/utils/bytes';
import { Fragment, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRefreshQuota } from '@/hooks/use-accounts';

export function StorageOverviewCard() {
  const { data: storage } = useStorage();
  const { data: accounts } = useAccounts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!storage || !accounts || accounts.length === 0) {
    return (
      <div className="h-64 w-full bg-surface animate-pulse rounded-lg border border-border" />
    );
  }

  const totalUsed = Number(storage.totalUsed) || 0;
  const totalLimit = Number(storage.totalLimit) || 1;
  const pct = Math.min(100, (totalUsed / totalLimit) * 100);

  return (
    <div className="border border-border rounded-lg p-6 lg:p-8 bg-white mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-[28px] font-medium tracking-tight text-text-primary mb-2">
            {formatBytes(totalUsed)} <span className="text-xl text-text-secondary font-normal">used of {formatBytes(totalLimit)}</span>
          </h2>
          <p className="text-sm text-text-tertiary">Combined storage across {accounts.length} accounts</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-medium text-text-primary">{formatBytes(storage.totalFree ?? String(Math.max(0, totalLimit - totalUsed)))} free</p>
          <p className="text-sm text-text-tertiary mt-1">Available for new uploads</p>
        </div>
      </div>

      <div className="h-3 w-full bg-surface rounded-full overflow-hidden flex mb-8">
        {mounted && accounts.map((acc, index) => {
          const used = Number(acc.storageUsed) || 0;
          const widthPct = (used / totalLimit) * 100;
          return (
            <div 
              key={acc.id}
              style={{ width: `${widthPct}%`, backgroundColor: acc.colorInfo?.dot }}
              className="h-full flex-shrink-0 transition-all duration-500 rounded-s-full border-r border-background last:border-r-0 last:rounded-e-full"
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {accounts.map(acc => (
          <div key={acc.id} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: acc.colorInfo?.dot }} />
            <div className="min-w-0">
               <div className="text-xs font-medium text-text-primary truncate">{acc.googleEmail}</div>
               <div className="text-xs text-text-tertiary">{formatBytes(Number(acc.storageUsed))}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountQuotaList() {
  const { data: accounts } = useAccounts();
  const { mutate: refresh } = useRefreshQuota();

  if (!accounts) return null;

  return (
    <div className="space-y-3">
      {accounts.map(account => {
        const used = Number(account.storageUsed) || 0;
        const limit = Number(account.storageLimit) || 1;
        const free = limit - used;
        const pct = (used / limit) * 100;

        return (
          <div key={account.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-lg">
            <div className="flex items-center gap-4 w-60 shrink-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                style={{ backgroundColor: account.colorInfo?.bg, color: account.colorInfo?.text }}
              >
                {account.googleEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">{account.googleEmail}</div>
                <div className="text-xs text-text-tertiary truncate">{account.displayName}</div>
              </div>
            </div>

            <div className="flex-1 px-8 hidden md:block">
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: account.colorInfo?.dot }}
                />
              </div>
            </div>

            <div className="w-40 shrink-0 text-right pr-4 hidden sm:block">
              <div className="text-sm font-medium text-text-primary">{formatBytes(free)} free</div>
              <div className="text-xs text-text-tertiary">{formatBytes(used)} used</div>
            </div>

            <Button variant="ghost" size="icon" onClick={() => refresh(account.id)} className="shrink-0 text-text-tertiary hover:text-text-primary">
              <RefreshCw className="w-4 h-4" />
              <span className="sr-only">Refresh quota</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function StatsStrip() {
  const { data: storage } = useStorage();
  const { data: accounts } = useAccounts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-[20px] bg-white border border-border rounded-[8px]">
        <div className="text-[12px] font-normal text-text-secondary mb-1">Accounts</div>
        <div className="text-[28px] font-medium text-text-primary">{accounts?.length || 0}</div>
      </div>
      <div className="p-[20px] bg-white border border-border rounded-[8px]">
        <div className="text-[12px] font-normal text-text-secondary mb-1">Total storage</div>
        <div className="text-[28px] font-medium text-text-primary">{storage ? formatBytes(storage.totalLimit) : '0 B'}</div>
      </div>
      <div className="p-[20px] bg-white border border-border rounded-[8px]">
        <div className="text-[12px] font-normal text-text-secondary mb-1">Used</div>
        <div className="text-[28px] font-medium text-text-primary">{storage ? formatBytes(storage.totalUsed) : '0 B'}</div>
      </div>
      <div className="p-[20px] bg-white border border-border rounded-[8px]">
        <div className="text-[12px] font-normal text-text-secondary mb-1">Free</div>
        <div className="text-[28px] font-medium text-text-primary">
          {storage ? formatBytes(storage.totalFree ?? String(Math.max(0, Number(storage.totalLimit) - Number(storage.totalUsed)))) : '0 B'}
        </div>
      </div>
    </div>
  );
}
