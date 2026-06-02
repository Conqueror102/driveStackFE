import { backendUrl, clearUserToken, getUserToken } from '@/lib/server/backend';
import { NextResponse } from 'next/server';

export async function POST() {
  const token = await getUserToken();

  if (token) {
    await fetch(backendUrl('/auth/logout'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }).catch(() => null);
  }

  const response = NextResponse.json({ success: true });
  clearUserToken(response);
  return response;
}
