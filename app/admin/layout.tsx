"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/stores/admin.store';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminToken = useAdminStore((state) => state.adminToken);
  const clearAdminToken = useAdminStore((state) => state.clearAdminToken);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !adminToken && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [adminToken, pathname, mounted, router]);

  if (!mounted) return null;

  if (!adminToken) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    clearAdminToken();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-zinc-100 flex flex-col">
        <div className="p-4 md:p-6 mb-4">
          <h2 className="text-xl font-bold tracking-tight">DriveStack Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 text-sm font-medium">
          <Link href="/admin" className={`block px-3 py-2 rounded-md hover:bg-zinc-800 ${pathname === '/admin' ? 'bg-zinc-800' : ''}`}>Overview</Link>
          <Link href="/admin/users" className={`block px-3 py-2 rounded-md hover:bg-zinc-800 ${pathname === '/admin/users' || pathname.startsWith('/admin/users') ? 'bg-zinc-800' : ''}`}>Users</Link>
          <Link href="/admin/audit" className={`block px-3 py-2 rounded-md hover:bg-zinc-800 ${pathname === '/admin/audit' ? 'bg-zinc-800' : ''}`}>Audit Log</Link>
          <Link href="/admin/pricing" className={`block px-3 py-2 rounded-md hover:bg-zinc-800 ${pathname === '/admin/pricing' ? 'bg-zinc-800' : ''}`}>Pricing</Link>
        </nav>
        <div className="p-4">
          <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-white border-l border-zinc-200 p-8">
        <div className="max-w-6xl mx-auto hidden md:block">
          {children}
        </div>
        <div className="md:hidden flex h-full items-center justify-center p-6 text-center">
          <p className="text-zinc-500">Please use desktop for admin. Admin pages are not optimised for mobile devices.</p>
        </div>
      </main>
    </div>
  );
}
