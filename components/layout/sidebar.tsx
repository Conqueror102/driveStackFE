'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Files, Users, Upload, Plus, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useAccounts } from '@/hooks/use-accounts';
import { useUploadStore } from '@/stores/upload.store';
import { formatBytes } from '@/lib/utils/bytes';
import { useLogout } from '@/hooks/use-auth';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { data: accounts } = useAccounts();
  const { setIsOpen } = useUploadStore();
  const logout = useLogout();

  const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard, shortcut: '⌘1' },
    { name: 'Files', href: '/files', icon: Files, shortcut: '⌘2' },
    { name: 'Accounts', href: '/accounts', icon: Users, shortcut: '⌘3' },
  ];
  navigation.push({ name: 'Settings', href: '/settings', icon: Settings, shortcut: '4' });

  return (
    <div className="hidden lg:flex w-[260px] flex-col bg-sidebar-bg text-sidebar-text h-screen sticky top-0 select-none">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">DriveStack</span>
        </div>
      </div>

      {/* Navigation */}
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
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? 'text-blue-400' : 'text-sidebar-text-muted group-hover:text-sidebar-text')} />
              <span className="flex-1">{item.name}</span>
              <span className="text-[11px] text-sidebar-text-muted opacity-0 group-hover:opacity-60 transition-opacity font-mono">{item.shortcut}</span>
            </Link>
          );
        })}

        {/* Connected Accounts Section */}
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
                    {/* Avatar */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold ring-2 ring-sidebar-bg hover:ring-sidebar-border transition-all relative bg-sidebar-hover text-sidebar-text"
                      style={{ backgroundColor: acc.colorInfo.bg, color: acc.colorInfo.text }}
                    >
                      <div 
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-sidebar-bg" 
                        style={{ backgroundColor: acc.colorInfo.dot }} 
                      />
                      {acc.googleEmail.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Popover */}
                    <div className="absolute left-0 top-full mt-2 w-48 bg-[#18181B] border border-sidebar-border rounded-xl p-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-[100] shadow-xl shadow-black/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: acc.colorInfo.dot }} />
                        <span className="text-[12px] text-white truncate font-medium">{acc.googleEmail}</span>
                      </div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] text-sidebar-text-muted font-medium">{formatBytes(used)}</span>
                        <span className={cn("text-[10px] font-mono", isHigh ? "text-amber-400" : "text-sidebar-text-muted")}>{pct}%</span>
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

        {/* Quick Actions */}
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

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-hover transition-colors group">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full flex items-center justify-center text-blue-400 font-medium text-[13px] shrink-0 ring-1 ring-white/10">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-sidebar-text truncate">{user?.displayName || 'User'}</p>
            <p className="text-[11px] text-sidebar-text-muted truncate">{user?.email}</p>
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
  );
}
