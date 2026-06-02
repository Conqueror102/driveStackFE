'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/lib/validations/auth.schema';
import { useResetPassword } from '@/hooks/use-auth';
import type { ResetPasswordInput } from '@/lib/contracts/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const resetPassword = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '' },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword.mutateAsync(data);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to reset password');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">Choose a new password</h2>
        <p className="text-[14px] text-text-secondary">Resetting your password signs out existing sessions.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('token')} />

        {!token && (
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-primary" htmlFor="token">Reset token</label>
            <Input id="token" placeholder="Paste reset token" {...register('token')} />
            {errors.token && <p className="text-[12px] text-danger mt-1">{errors.token.message}</p>}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-primary" htmlFor="password">New password</label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...register('password')} />
          {errors.password && <p className="text-[12px] text-danger mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={resetPassword.isPending} className="w-full h-10 bg-text-primary text-white hover:bg-text-primary/90">
          {resetPassword.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
          Reset password
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="text-[13px] text-text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
