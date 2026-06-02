import {
  backendUrl,
  clearUserToken,
  getUserToken,
} from '@/lib/server/backend';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PREFIXES = ['google-accounts', 'storage', 'files'];

function isAllowed(path: string) {
  return ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = await getUserToken();
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const params = await context.params;
  const path = params.path.join('/');
  if (!isAllowed(path)) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const target = new URL(backendUrl(`/${path}`));
  target.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const backendResponse = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
    redirect: 'manual',
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  const backendContentType = backendResponse.headers.get('content-type');
  if (backendContentType) responseHeaders.set('Content-Type', backendContentType);

  const response = new NextResponse(await backendResponse.text(), {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  if (backendResponse.status === 401) clearUserToken(response);
  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
