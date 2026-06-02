import {
  passwordResetRequestResponseSchema,
  passwordResetRequestSchema,
} from '@/lib/contracts/auth';
import { backendError, backendUrl, readJson } from '@/lib/server/backend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const input = passwordResetRequestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ message: input.error.issues.map((issue) => issue.message) }, { status: 400 });
  }

  const backendResponse = await fetch(backendUrl('/auth/password/request-reset'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input.data),
    cache: 'no-store',
  });

  const body = await readJson(backendResponse);
  if (!backendResponse.ok) return NextResponse.json(body, { status: backendResponse.status });

  const parsed = passwordResetRequestResponseSchema.safeParse(body);
  if (!parsed.success) return backendError(502, 'Invalid password reset request response from backend');

  return NextResponse.json(parsed.data);
}
