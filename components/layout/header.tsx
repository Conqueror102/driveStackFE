'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { Search, Upload, Menu, X } from 'lucide-react';
import { useUploadStore } from '@/stores/upload.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { NotificationBell } from '@/components/notifications/notification-bell';

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/overview': { title: 'Overview', subtitle: 'Your storage at a glance' },
  '/files': { title: 'Files', subtitle: 'All files across your accounts' },
  '/duplicates': { title: 'Duplicates', subtitle: 'Review repeated files' },
  '/trash': { title: 'Trash', subtitle: 'Restore files moved to trash' },
  '/notifications': { title: 'Notifications', subtitle: 'Recent DriveStack updates' },
  '/accounts': { title: 'Accounts', subtitle: 'Manage connected Google accounts' },
  '/storage': { title: 'Storage', subtitle: 'Quota breakdown' },
  '/settings': { title: 'Settings', subtitle: 'Account security' },
};

export const Header: FC<{ onMobileMenuToggle?: () => void; mobileMenuOpen?: boolean }> = ({ onMobileMenuToggle, mobileMenuOpen }) => {
  const pathname = usePathname();
  const { setIsOpen } = useUploadStore();
  const user = useAuthStore((state) => state.user);
  const [searchFocused, setSearchFocused] = useState(false);

  const pageInfo = PAGE_TITLES[pathname] || { title: '' };

  return (
    <header className="h-14 border-b border-border bg-white/80 backdrop-blur-md flex items-center px-4 lg:px-6 justify-between sticky top-0 z-30">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 -ml-1 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <Image src="/assets/driveStackLogo.png" alt="DriveStack Logo" fill className="object-cover scale-[1.6]" />
          </div>
          <span className="text-[18px] font-black tracking-tighter text-text-primary">DriveStack</span>
        </div>

        {/* Desktop: Page title */}
        <div className="hidden lg:block">
          <h1 className="text-[15px] font-semibold text-text-primary leading-tight">{pageInfo.title}</h1>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className={cn(
          "relative w-full transition-all duration-200",
          searchFocused && "scale-[1.02]"
        )}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search files..."
            className={cn(
              "w-full h-8 pl-9 pr-12 text-[13px] bg-surface border border-transparent rounded-lg",
              "placeholder:text-text-tertiary text-text-primary",
              "focus:outline-none focus:border-border-strong focus:bg-white focus:shadow-sm",
              "transition-all duration-200"
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-white px-1.5 font-mono text-[10px] font-medium text-text-tertiary">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Mobile search */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Upload button */}
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-all duration-200",
            "bg-text-primary text-white hover:bg-text-primary/90 active:scale-[0.97]"
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>

        {/* Mobile upload */}
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
          aria-label="Upload"
        >
          <Upload className="h-4 w-4" />
        </button>

        <div className="[&_[aria-label='Notifications']]:text-text-tertiary [&_[aria-label='Notifications']]:hover:bg-surface [&_[aria-label='Notifications']]:hover:text-text-primary [&_[aria-label='Notifications']_.ring-sidebar-bg]:ring-white">
          <NotificationBell />
        </div>

        {/* User avatar (desktop) */}
        <div className="hidden lg:flex items-center ml-1">
          <div className="h-7 w-7 bg-ds-pure-black rounded-full flex items-center justify-center text-white font-medium text-[12px] ring-1 ring-border">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
