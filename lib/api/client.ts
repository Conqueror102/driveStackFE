import { z } from 'zod';
import { normalizeApiMessage } from '@/lib/contracts/shared';
import { useAuthStore } from '@/stores/auth.store';

export class ApiClientError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, fallback = 'Request failed') {
    super(normalizeApiMessage(body, fallback));
    this.name = 'ApiClientError';
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions<T> = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  schema?: z.ZodType<T>;
  suppressUnauthorizedRedirect?: boolean;
};

let isHandlingUnauthorized = false;

async function handleUnauthorized() {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  useAuthStore.getState().clearSession();
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);

  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions<T> = {}) {
  const response = await fetch(path, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'same-origin',
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401 && !options.suppressUnauthorizedRedirect) void handleUnauthorized();
    throw new ApiClientError(response.status, body);
  }

  if (!options.schema) return body as T;

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiClientError(502, {
      message: 'Frontend contract validation failed',
      issues: parsed.error.issues,
    });
  }

  return parsed.data;
}

export function toSearchParams(params: Record<string, unknown>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}
