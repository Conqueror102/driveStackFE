import type { ListFilesParams } from '@/lib/contracts/files';

export const QUERY_KEYS = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  accounts: {
    list: () => ['accounts', 'list'] as const,
    quota: (id: string) => ['accounts', 'quota', id] as const,
  },
  storage: {
    summary: (fileSize?: number) => ['storage', 'summary', fileSize ?? null] as const,
    history: (days: number) => ['storage', 'history', days] as const,
  },
  files: {
    list: (params?: ListFilesParams) => ['files', 'list', params ?? {}] as const,
    root: () => ['files'] as const,
    links: (accountId: string, fileId: string) => ['files', 'links', accountId, fileId] as const,
    duplicates: () => ['files', 'duplicates'] as const,
    duplicateCount: () => ['files', 'duplicates', 'count'] as const,
    preview: (accountId: string, fileId: string) => ['files', 'preview', accountId, fileId] as const,
    moveStatus: (operationId: string) => ['files', 'move', operationId] as const,
    moveHistory: () => ['files', 'move', 'history'] as const,
    trash: () => ['files', 'trash'] as const,
  },
  uploads: {
    session: (id: string) => ['uploads', 'session', id] as const,
  },
  alerts: {
    list: () => ['alerts'] as const,
  },
  notifications: {
    list: () => ['notifications'] as const,
  },
  activity: {
    recent: () => ['activity', 'recent'] as const,
    list: (type?: string) => ['activity', 'list', type ?? null] as const,
  },
  subscription: {
    status: () => ['subscription', 'status'] as const,
  },
  referrals: {
    stats: () => ['referrals', 'stats'] as const,
  },
  payments: {
    history: () => ['payments', 'history'] as const,
  },
  admin: {
    auditLog: (params?: object) => ['admin', 'audit', params] as const,
    revenue: () => ['admin', 'revenue'] as const,
    users: (params?: object) => ['admin', 'users', params] as const,
  },
} as const;
