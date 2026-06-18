'use client';

import { Bell, CheckCheck, CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/use-notifications';
import { formatRelative } from '@/lib/utils/dates';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Notifications" subtitle="Move, quota, duplicate, and cleanup updates" count={unreadCount}>
        <Button variant="outline" onClick={() => markAll.mutate()} disabled={unreadCount === 0 || markAll.isPending} className="bg-white">
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="h-80 rounded-xl border border-border bg-surface animate-pulse" />
      ) : notifications.length === 0 ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white text-center">
          <Bell className="mb-4 h-12 w-12 text-text-tertiary" />
          <h2 className="text-lg font-semibold text-text-primary">No notifications yet</h2>
          <p className="mt-2 text-[13px] text-text-secondary">Completed moves, alerts, and scans will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {notifications.map((item) => {
            const isWarning = item.type.includes('ALERT') || item.type.includes('FAILED');
            const Icon = isWarning ? CircleAlert : CircleCheck;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => !item.read && markRead.mutate(item.id)}
                className={cn(
                  'grid w-full grid-cols-[44px_1fr_auto] items-start gap-4 border-b border-border px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-surface',
                  !item.read && 'bg-accent-subtle/40'
                )}
              >
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isWarning ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success')}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-text-primary">{item.message}</span>
                  <span className="mt-1 block text-[11px] uppercase tracking-wide text-text-tertiary">{item.type.replaceAll('_', ' ')}</span>
                </span>
                <span className="text-[12px] text-text-tertiary">{formatRelative(item.createdAt)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
