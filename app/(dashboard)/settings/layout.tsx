'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@/components/common/page-header';
import { cn } from '@/lib/utils';
import { ShieldCheck, CreditCard, Gift } from 'lucide-react';

const tabs = [
  { name: 'Security', href: '/settings', icon: ShieldCheck },
  { name: 'Billing', href: '/settings/billing', icon: CreditCard },
  { name: 'Referrals', href: '/settings/referrals', icon: Gift },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <PageHeader title="Settings" subtitle="Manage your account preferences and subscriptions" />
      
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-[14px] rounded-lg transition-colors',
                  isActive
                    ? 'bg-text-primary text-white font-medium'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
