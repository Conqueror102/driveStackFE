'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">No worries.</h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Your free account is still active.<br />
            You can upgrade whenever you're ready.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/overview">
            <Button variant="outline">← Back to DriveStack</Button>
          </Link>
          <Link href="/pricing">
            <Button className="bg-text-primary text-white hover:bg-text-primary/90">View pricing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
