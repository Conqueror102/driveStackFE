'use client';

import { cn } from '@/lib/utils';

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded bg-text-primary text-white text-[10px] font-semibold uppercase tracking-wide leading-none',
        className
      )}
    >
      Pro
    </span>
  );
}
