'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { UploadZone } from '../upload/upload-zone';
import { UploadStagingBar } from '../upload/upload-staging-bar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background min-h-screen relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-6 overflow-y-auto pb-20 lg:pb-6">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <UploadZone />
      <UploadStagingBar />
    </div>
  );
}
