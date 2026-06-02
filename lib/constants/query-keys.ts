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
    summary: () => ['storage', 'summary'] as const,
  },
  files: {
    list: (params?: ListFilesParams) => ['files', 'list', params ?? {}] as const,
    root: () => ['files'] as const,
    links: (accountId: string, fileId: string) => ['files', 'links', accountId, fileId] as const,
  },
  uploads: {
    session: (id: string) => ['uploads', 'session', id] as const,
  },
} as const;
