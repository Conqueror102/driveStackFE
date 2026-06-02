import { create } from 'zustand';

export interface UploadItem {
  id: string;
  sessionId: string;
  file: File;
  accountId: string;
  accountEmail: string;
  progress: number;
  status: 'pending' | 'uploading' | 'verifying' | 'complete' | 'error';
  error?: string;
}

interface UploadStore {
  queue: UploadItem[];
  isOpen: boolean;
  stagedFiles: File[];
  addToQueue: (items: UploadItem[]) => void;
  updateProgress: (id: string, progress: number) => void;
  setStatus: (id: string, status: UploadItem['status'], error?: string) => void;
  stageFiles: (files: File[]) => void;
  clearStaged: () => void;
  dismiss: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  queue: [],
  isOpen: false,
  stagedFiles: [],
  addToQueue: (items) => set((state) => ({ queue: [...state.queue, ...items] })),
  updateProgress: (id, progress) =>
    set((state) => ({
      queue: state.queue.map((item) => (item.id === id ? { ...item, progress } : item)),
    })),
  setStatus: (id, status, error) =>
    set((state) => ({
      queue: state.queue.map((item) => (item.id === id ? { ...item, status, error } : item)),
    })),
  stageFiles: (files) => set({ stagedFiles: files, isOpen: true }),
  clearStaged: () => set({ stagedFiles: [], isOpen: false }),
  dismiss: (id) =>
    set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
