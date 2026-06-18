'use client';

import { Bell, CheckCheck, CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/use-notifications';
import { formatRelative } from '@/lib/utils/dates';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unread = notifications.filter((item) => !item.read);

  return (
    <Popover>
      <PopoverTrigger
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-text-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-text"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread.length > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-sidebar-bg" />
        )}
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80 gap-0 overflow-hidden rounded-xl border-border p-0 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <div className="text-[13px] font-semibold text-text-primary">Notifications</div>
            <div className="text-[11px] text-text-tertiary">{unread.length} unread</div>
          </div>
          <Button variant="ghost" size="sm" disabled={unread.length === 0 || markAll.isPending} onClick={() => markAll.mutate()}>
            <CheckCheck className="h-3.5 w-3.5" />
            Read all
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-text-tertiary">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <CircleCheck className="mx-auto mb-3 h-8 w-8 text-success" />
              <p className="text-[13px] font-medium text-text-primary">Nothing new</p>
              <p className="text-[12px] text-text-tertiary">Move and quota updates will appear here.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isWarning = item.type.includes('ALERT') || item.type.includes('FAILED');
              const Icon = isWarning ? CircleAlert : CircleCheck;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => !item.read && markRead.mutate(item.id)}
                  className={cn(
                    'grid w-full grid-cols-[28px_1fr] gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface',
                    !item.read && 'border-l-2 border-l-accent bg-accent-subtle/40'
                  )}
                >
                  <div className={cn('mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg', isWarning ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success')}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[12px] font-medium leading-5 text-text-primary">{item.message}</p>
                    <p className="mt-1 text-[11px] text-text-tertiary">{formatRelative(item.createdAt)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
