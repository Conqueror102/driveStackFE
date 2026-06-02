import 'server-only';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const USER_TOKEN_COOKIE = 'drivestack_user_token';

export const authCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export function getBackendBaseUrl() {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000'
  ).replace(/\/$/, '');
}

export function backendUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalizedPath}`;
}

export async function getUserToken() {
  return (await cookies()).get(USER_TOKEN_COOKIE)?.value ?? null;
}

export function setUserToken(response: NextResponse, token: string) {
  response.cookies.set(USER_TOKEN_COOKIE, token, authCookieOptions);
}

export function clearUserToken(response: NextResponse) {
  response.cookies.set(USER_TOKEN_COOKIE, '', {
    ...authCookieOptions,
    maxAge: 0,
  });
}

export async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function backendError(status = 502, message = 'Backend request failed') {
  return NextResponse.json(
    {
      statusCode: status,
      message,
      error: status >= 500 ? 'Bad Gateway' : 'Request Failed',
      timestamp: new Date().toISOString(),
      path: '',
    },
    { status }
  );
}
