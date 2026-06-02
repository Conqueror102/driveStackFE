import { changePasswordSchema } from '@/lib/contracts/auth';
import { successSchema } from '@/lib/contracts/shared';
import {
  backendError,
  backendUrl,
  clearUserToken,
  getUserToken,
  readJson,
} from '@/lib/server/backend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = await getUserToken();
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const input = changePasswordSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ message: input.error.issues.map((issue) => issue.message) }, { status: 400 });
  }

  const backendResponse = await fetch(backendUrl('/auth/password/change'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input.data),
    cache: 'no-store',
  });

  const body = await readJson(backendResponse);
  if (!backendResponse.ok) {
    const response = NextResponse.json(body, { status: backendResponse.status });
    if (backendResponse.status === 401) clearUserToken(response);
    return response;
  }

  const parsed = successSchema.safeParse(body);
  if (!parsed.success) return backendError(502, 'Invalid change password response from backend');

  const response = NextResponse.json(parsed.data);
  clearUserToken(response);
  return response;
}
