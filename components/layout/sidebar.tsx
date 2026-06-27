'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, Check, Copy, Files, HardDrive, LayoutDashboard, LogOut, Plus, Settings, Trash2, Upload, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useSubscriptionStore } from '@/stores/subscription.store';
import { useAccounts } from '@/hooks/use-accounts';
import { useUploadStore } from '@/stores/upload.store';
import { formatBytes } from '@/lib/utils/bytes';
import { useLogout } from '@/hooks/use-auth';
import { useDuplicateCount } from '@/hooks/use-files';
import { NotificationBell } from '@/components/notifications/notification-bell';

export function Sidebar({ mobileMenuOpen, onClose }: { mobileMenuOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isPro = useSubscriptionStore((state) => state.isPro());
  const { data: accounts } = useAccounts();
  const { data: duplicateCount } = useDuplicateCount();
  const { setIsOpen } = useUploadStore();
  const logout = useLogout();

  const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard, shortcut: '1' },
    { name: 'Files', href: '/files', icon: Files, shortcut: '2' },
    { name: 'Duplicates', href: '/duplicates', icon: Copy, shortcut: '3', badge: duplicateCount?.count },
    { name: 'Storage', href: '/storage', icon: HardDrive, shortcut: '4' },
    { name: 'Trash', href: '/trash', icon: Trash2, shortcut: '5' },
    { name: 'Notifications', href: '/notifications', icon: Bell, shortcut: '6' },
    { name: 'Accounts', href: '/accounts', icon: Users, shortcut: '7' },
    { name: 'Settings', href: '/settings', icon: Settings, shortcut: '8' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div className={cn(
        "w-[260px] flex-col bg-sidebar-bg text-sidebar-text h-screen select-none z-50",
        mobileMenuOpen ? "flex fixed inset-y-0 left-0 shadow-2xl" : "hidden lg:flex lg:sticky lg:top-0"
      )}>
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src="/assets/driveStackLogo.png" alt="DriveStack Logo" fill className="object-cover scale-[1.6]" />
            </div>
            <span className="text-[18px] font-black tracking-tighter text-white">DriveStack</span>
          </div>
          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden p-1.5 text-sidebar-text-muted hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = item.href === '/overview'
            ? pathname === '/overview' || pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all duration-150',
                isActive
                  ? 'bg-sidebar-active text-white font-medium'
                  : 'text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text'
              )}
            >
              <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-sidebar-text-muted group-hover:text-sidebar-text')} />
              <span className="flex-1">{item.name}</span>
              {Boolean(item.badge) && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
              <span className="text-[11px] text-sidebar-text-muted opacity-0 group-hover:opacity-60 transition-opacity font-mono">{item.shortcut}</span>
            </Link>
          );
        })}

        {accounts && accounts.length > 0 && (
          <div className="pt-6">
            <div className="px-3 mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium text-sidebar-text-muted uppercase tracking-wider">Connected</span>
              <span className="text-[11px] text-sidebar-text-muted">{accounts.length}</span>
            </div>
            <div className="px-4 flex -space-x-2">
              {accounts.map((acc: any) => {
                const used = Number(acc.storageUsed) || 0;
                const limit = Number(acc.storageLimit) || 1;
                const pct = Math.min(100, Math.round((used / limit) * 100));
                const isHigh = pct >= 85;

                return (
                  <div key={acc.id} className="relative group cursor-default">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ring-2 ring-sidebar-bg hover:ring-sidebar-border transition-all relative bg-sidebar-hover text-sidebar-text"
                      style={{ backgroundColor: acc.colorInfo.bg, color: acc.colorInfo.text }}
                    >
                      <div
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-sidebar-bg"
                        style={{ backgroundColor: acc.isDefault ? '#60A5FA' : acc.colorInfo.dot }}
                      />
                      {acc.googleEmail.charAt(0).toUpperCase()}
                    </div>

                    <div className="absolute left-0 top-full mt-2 w-48 bg-[#18181B] border border-sidebar-border rounded-xl p-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-[100] shadow-xl shadow-black/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: acc.colorInfo.dot }} />
                        <span className="text-[12px] text-white truncate font-medium">{acc.googleEmail}</span>
                      </div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] text-sidebar-text-muted font-medium">{formatBytes(used)}</span>
                        <span className={cn('text-[10px] font-mono', isHigh ? 'text-amber-400' : 'text-sidebar-text-muted')}>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: isHigh ? '#FBBF24' : acc.colorInfo.dot }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-6">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-medium text-sidebar-text-muted uppercase tracking-wider">Quick Actions</span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload files</span>
          </button>
          <Link
            href="/accounts"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Connect account</span>
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="mb-2 flex items-center justify-between px-2">
          <NotificationBell />
          <Link href="/settings" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-text-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-text" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-hover transition-colors group">
          <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-white font-medium text-[13px] shrink-0 ring-1 ring-white/10">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-sidebar-text truncate">{user?.displayName || 'User'}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] text-sidebar-text-muted truncate">{user?.email}</p>
            </div>
            {isPro ? (
              <span className="text-[11px] text-sidebar-text-muted flex items-center gap-1 mt-0.5">
                Pro <Check className="h-3 w-3 text-white" />
              </span>
            ) : (
              <Link href="/pricing" className="text-[11px] text-sidebar-text-muted hover:text-white transition-colors mt-0.5 inline-block">
                Upgrade →
              </Link>
            )}
          </div>
          <button
            onClick={() => logout.mutate()}
            className="p-1.5 text-sidebar-text-muted hover:text-red-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
