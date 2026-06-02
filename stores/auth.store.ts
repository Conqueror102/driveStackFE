import { create } from 'zustand';
import type { User } from '@/lib/contracts/auth';

interface AuthState {
  user: User | null;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setSession: (user: User) => void;
  clearSession: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: true,
  setUser: (user) => set({ user }),
  setSession: (user) => set({ user }),
  clearSession: () => set({ user: null }),
  setHydrated: () => set({ isHydrated: true }),
}));

export type { User };
