'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCurrentUser, useRequestEmailVerification, useVerifyEmail } from '@/hooks/use-auth';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { data: user } = useCurrentUser();
  const verifyEmail = useVerifyEmail();
  const requestVerification = useRequestEmailVerification();
  const { mutate, isPending, isSuccess } = verifyEmail;

  useEffect(() => {
    if (!token || isPending || isSuccess) return;

    mutate(token, {
      onSuccess: () => {
        router.replace('/overview');
      },
      onError: (error: any) => toast.error(error?.message || 'Unable to verify email'),
    });
  }, [isPending, isSuccess, mutate, router, token]);

  const requestEmail = async () => {
    try {
      const response = await requestVerification.mutateAsync();
      if (response.token) toast.message(`Development verification token: ${response.token}`);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to send verification email');
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-[440px] bg-white border border-border rounded-2xl p-8 shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-accent-subtle text-accent flex items-center justify-center mb-6">
          {verifyEmail.isSuccess ? <CheckCircle2 className="w-5 h-5" /> : <MailCheck className="w-5 h-5" />}
        </div>

        <h1 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">Verify your email</h1>
        <p className="text-[14px] leading-6 text-text-secondary mb-6">
          {token
            ? 'We are confirming your verification link.'
            : 'Check your inbox for a verification link before continuing with DriveStack.'}
        </p>

        {verifyEmail.isPending ? (
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying email...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {user && !user.emailVerified && (
              <Button onClick={requestEmail} disabled={requestVerification.isPending} className="bg-text-primary text-white hover:bg-text-primary/90">
                {requestVerification.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Send verification email
              </Button>
            )}
            <Link
              href={user ? '/overview' : '/login'}
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              {user ? 'Go to overview' : 'Back to sign in'}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
