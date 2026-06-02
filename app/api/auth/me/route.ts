import { userSchema } from '@/lib/contracts/auth';
import {
  backendError,
  backendUrl,
  clearUserToken,
  getUserToken,
  readJson,
} from '@/lib/server/backend';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = await getUserToken();
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const backendResponse = await fetch(backendUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const body = await readJson(backendResponse);
  if (!backendResponse.ok) {
    const response = NextResponse.json(body, { status: backendResponse.status });
    if (backendResponse.status === 401) clearUserToken(response);
    return response;
  }

  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return backendError(502, 'Invalid current user response from backend');

  return NextResponse.json(parsed.data);
}
