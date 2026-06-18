import { create } from 'zustand';

interface AdminStore {
  adminToken: string | null;
  setAdminToken: (token: string) => void;
  clearAdminToken: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  adminToken: null,
  setAdminToken: (token) => set({ adminToken: token }),
  clearAdminToken: () => set({ adminToken: null }),
}));
