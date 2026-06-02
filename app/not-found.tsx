import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-6 text-center">
      <h2 className="text-4xl font-semibold tracking-tight text-text-primary mb-2">404</h2>
      <p className="text-text-secondary mb-8">This page could not be found.</p>
      <Link href="/">
        <Button className="bg-accent text-white hover:bg-accent-hover">Return Home</Button>
      </Link>
    </div>
  );
}
