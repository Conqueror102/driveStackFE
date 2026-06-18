import { useState } from 'react';
import { useAccounts, useRefreshQuota, useDisconnectAccount, useSetDefaultAccount } from '@/hooks/use-accounts';
import { formatBytes } from '@/lib/utils/bytes';
import { formatRelative } from '@/lib/utils/dates';
import { MoreVertical, RefreshCw, ExternalLink, Unplug, Cloud, AlertTriangle, CheckCircle2, Bell, Star } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '../common/confirm-dialog';
import { ConnectAccountButton } from './connect-account-button';
import { useAlerts, useToggleAlert } from '@/hooks/use-alerts';

export function AccountsList() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse stagger-children">
      <div className="h-[280px] w-full bg-surface rounded-2xl border border-border" />
      <div className="h-[280px] w-full bg-surface rounded-2xl border border-border" />
    </div>;
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center animate-scale-in bg-white/50">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-violet-600/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Cloud className="w-10 h-10 text-accent stroke-[1.5px]" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary tracking-tight">Connect your first Google account</h3>
        <p className="text-[14px] text-text-secondary mb-8 max-w-sm">Each account adds 15 GB of free storage. You can connect as many drives as you need to build your unified stack.</p>
        <ConnectAccountButton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children pb-20">
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

function AccountCard({ account }: { account: any }) {
  const { mutate: refresh, isPending: isRefreshing } = useRefreshQuota();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectAccount();
  const setDefault = useSetDefaultAccount();
  const { data: alerts = [] } = useAlerts();
  const toggleAlert = useToggleAlert();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const used = Number(account.storageUsed);
  const limit = Number(account.storageLimit);
  const pct = Math.min(100, Math.round((used / limit) * 100)) || 0;
  
  const isAlmostFull = pct >= 90;
  const statusConfigMap = {
    ACTIVE: { label: 'Active', className: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
    REAUTH_REQUIRED: { label: 'Reconnect required', className: 'bg-amber-50 text-amber-700', icon: AlertTriangle },
    SYNC_FAILED: { label: 'Sync failed', className: 'bg-red-50 text-red-700', icon: AlertTriangle },
    DISCONNECTED: { label: 'Disconnected', className: 'bg-zinc-100 text-zinc-600', icon: AlertTriangle },
  };
  const statusConfig = statusConfigMap[(account.status || 'ACTIVE') as keyof typeof statusConfigMap];
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="border border-border rounded-2xl bg-white flex flex-col shadow-sm hover:shadow-md transition-all duration-300 card-hover group relative overflow-hidden">
        
        {/* Subtle gradient orb in the background */}
        <div 
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-[0.04] group-hover:opacity-[0.08] blur-3xl transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: account.colorInfo.dot }}
        />

        {account.isDefault && (
          <div className="absolute right-4 top-4 z-20 rounded-md bg-text-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Default
          </div>
        )}

        <div className="p-6 flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm border border-border/50"
              style={{ backgroundColor: account.colorInfo.bg, color: account.colorInfo.text }}
            >
              {account.googleEmail.charAt(0).toUpperCase()}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 hover:bg-surface rounded-xl text-text-tertiary hover:text-text-primary transition-colors focus-ring">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border p-1">
                <DropdownMenuItem onClick={() => refresh(account.id)} className="gap-2 text-[13px] rounded-lg cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh quota
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDefault.mutate({ id: account.id, isDefault: Boolean(account.isDefault) })} className="gap-2 text-[13px] rounded-lg cursor-pointer">
                  <Star className="w-3.5 h-3.5" /> {account.isDefault ? 'Remove default' : 'Set as default'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAlerts((value) => !value)} className="gap-2 text-[13px] rounded-lg cursor-pointer">
                  <Bell className="w-3.5 h-3.5" /> Storage alerts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://drive.google.com', '_blank')} className="gap-2 text-[13px] rounded-lg cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" /> Open standard Drive
                </DropdownMenuItem>
                <div className="h-px bg-border my-1" />
                <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-danger focus:bg-danger-subtle focus:text-danger gap-2 text-[13px] rounded-lg cursor-pointer">
                  <Unplug className="w-3.5 h-3.5" /> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-8">
            <h3 className="text-[16px] font-semibold text-text-primary tracking-tight truncate">{account.googleEmail}</h3>
            <p className="text-[13px] text-text-secondary mt-1 truncate flex items-center gap-2">
              {account.displayName || 'Google Drive Account'}
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{formatRelative(account.createdAt)}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium ${statusConfig.className}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
              {account.lastSyncError && (
                <span className="text-[11px] text-danger bg-danger-subtle rounded-full px-2 py-1 truncate max-w-full">
                  {account.lastSyncError}
                </span>
              )}
            </div>
          </div>

          {showAlerts && (
            <div className="mb-5 rounded-xl border border-border bg-[#101114] p-4 text-white shadow-xl">
              <div className="mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-300" />
                <span className="text-[13px] font-semibold">Storage alerts</span>
              </div>
              <div className="space-y-2">
                {([80, 90] as const).map((threshold) => {
                  const alert = alerts.find((item) => item.accountId === account.id && item.threshold === threshold);
                  return (
                    <label key={threshold} className="flex cursor-pointer items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-[13px]">
                      <span>{threshold}% full</span>
                      <input
                        type="checkbox"
                        checked={Boolean(alert)}
                        onChange={(event) => toggleAlert.mutate({ accountId: account.id, threshold, alertId: alert?.id, enabled: event.target.checked })}
                        className="h-4 w-4 accent-blue-500"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nested Storage Box */}
          <div className="mt-auto bg-[#F9FAFB] rounded-xl p-4 border border-border/60 group-hover:bg-white group-hover:border-border transition-colors duration-300">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[12px] font-medium text-text-secondary">Storage usage</span>
              <span className="text-[12px] font-mono font-medium text-text-primary">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${pct}%`, backgroundColor: isAlmostFull ? '#FBBF24' : account.colorInfo.dot }}
              >
                <div className="absolute inset-0 bg-white/10 w-full h-full" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-text-tertiary font-mono">
              <span>{formatBytes(used)}</span>
              <span>{formatBytes(limit)}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Disconnect Account"
        description={`Disconnecting ${account.googleEmail} will remove it from DriveStack. Your files on Google Drive will not be deleted. You can reconnect at any time.`}
        confirmText="Disconnect account"
        destructive={true}
        onConfirm={() => disconnect(account.id)}
      />
    </>
  );
}
