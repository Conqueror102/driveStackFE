import { backendUrl } from '@/lib/server/backend';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const target = new URL(backendUrl('/payments/pricing'));
    const backendResponse = await fetch(target, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ message: 'Failed to fetch pricing' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
