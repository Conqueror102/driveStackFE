'use client';

import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/use-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
