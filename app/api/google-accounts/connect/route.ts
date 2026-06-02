import { backendUrl, getUserToken } from '@/lib/server/backend';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = await getUserToken();
  if (!token) return NextResponse.redirect(new URL('/login', request.nextUrl.origin));

  const backendResponse = await fetch(backendUrl('/google-accounts/connect'), {
    headers: { Authorization: `Bearer ${token}` },
    redirect: 'manual',
    cache: 'no-store',
  });

  const location = backendResponse.headers.get('location');
  if (location && backendResponse.status >= 300 && backendResponse.status < 400) {
    return NextResponse.redirect(location);
  }

  if (backendResponse.ok && location) {
    return NextResponse.redirect(location);
  }

  return NextResponse.redirect(new URL('/accounts?error=oauth_failed', request.nextUrl.origin));
}
