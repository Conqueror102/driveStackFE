'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Copy, Files, HardDrive, LayoutDashboard, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadStore } from '@/stores/upload.store';

export function MobileNav() {
  const pathname = usePathname();
  const { setIsOpen } = useUploadStore();

  const items = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Files', href: '/files', icon: Files },
    { name: 'Duplicates', href: '/duplicates', icon: Copy },
    { name: 'Storage', href: '/storage', icon: HardDrive },
    { name: 'Trash', href: '/trash', icon: Trash2 },
    { name: 'Alerts', href: '/notifications', icon: Bell },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border safe-area-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {items.map((item, index) => {
          const isActive = item.href === '/overview'
            ? pathname === '/overview' || pathname === '/'
            : pathname.startsWith(item.href);

          // Insert the upload FAB after the second item
          if (index === 1) {
            return (
              <div key="nav-with-upload" className="contents">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors',
                    isActive ? 'text-accent' : 'text-text-tertiary'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', isActive && 'text-accent')} />
                  <span className={cn(
                    'text-[10px] font-medium',
                    isActive ? 'text-accent' : 'text-text-tertiary'
                  )}>{item.name}</span>
                </Link>

                {/* Upload FAB */}
                <div className="flex flex-col items-center justify-center flex-1 py-1">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-11 h-11 -mt-5 bg-ds-pure-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/25 active:scale-95 transition-transform"
                    aria-label="Upload files"
                  >
                    <Upload className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors',
                isActive ? 'text-accent' : 'text-text-tertiary'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-accent')} />
              <span className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-accent' : 'text-text-tertiary'
              )}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
