'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { passwordResetRequestSchema } from '@/lib/validations/auth.schema';
import { useRequestPasswordReset } from '@/hooks/use-auth';
import { z } from 'zod';

type FormInput = z.infer<typeof passwordResetRequestSchema>;

export default function ForgotPasswordPage() {
  const requestReset = useRequestPasswordReset();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInput>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const onSubmit = async (data: FormInput) => {
    try {
      const response = await requestReset.mutateAsync(data.email);
      reset();
      toast.success('If that email exists, a reset link has been sent.');
      if (response.token) toast.message(`Development reset token: ${response.token}`);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to request reset');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">Reset your password</h2>
        <p className="text-[14px] text-text-secondary">Enter your email and we will send a reset link if the account exists.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-primary" htmlFor="email">Email address</label>
          <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" {...register('email')} />
          {errors.email && <p className="text-[12px] text-danger mt-1">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={requestReset.isPending} className="w-full h-10 bg-text-primary text-white hover:bg-text-primary/90">
          {requestReset.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
          Send reset link
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
