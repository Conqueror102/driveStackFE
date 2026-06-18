'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ProFeature } from '@/stores/subscription.store';

interface UpgradeModalContextType {
  isOpen: boolean;
  feature: ProFeature | null;
  openUpgradeModal: (feature: ProFeature) => void;
  closeUpgradeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextType | null>(null);

export function UpgradeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState<ProFeature | null>(null);

  const openUpgradeModal = useCallback((f: ProFeature) => {
    setFeature(f);
    setIsOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsOpen(false);
    setFeature(null);
  }, []);

  return (
    <UpgradeModalContext.Provider value={{ isOpen, feature, openUpgradeModal, closeUpgradeModal }}>
      {children}
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal() {
  const ctx = useContext(UpgradeModalContext);
  if (!ctx) throw new Error('useUpgradeModal must be used within UpgradeModalProvider');
  return ctx;
}
