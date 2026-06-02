import {
  authResponseSchema,
  backendRegisterRequestSchema,
  registerRequestSchema,
} from '@/lib/contracts/auth';
import { backendError, backendUrl, readJson, setUserToken } from '@/lib/server/backend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const input = registerRequestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ message: input.error.issues.map((issue) => issue.message) }, { status: 400 });
  }

  const backendPayload = backendRegisterRequestSchema.parse(input.data);
  const backendResponse = await fetch(backendUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(backendPayload),
    cache: 'no-store',
  });

  const body = await readJson(backendResponse);
  if (!backendResponse.ok) {
    return NextResponse.json(body, { status: backendResponse.status });
  }

  const parsed = authResponseSchema.safeParse(body);
  if (!parsed.success) return backendError(502, 'Invalid register response from backend');

  const response = NextResponse.json({ user: parsed.data.user });
  setUserToken(response, parsed.data.token);
  return response;
}
