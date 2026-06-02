'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth.schema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogin } from '@/hooks/use-auth';

export default function LoginPage() {
  const login = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login.mutateAsync(data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to sign in');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">Welcome back</h2>
        <p className="text-[14px] text-text-secondary">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-primary" htmlFor="email">Email address</label>
          <Input 
            id="email"
            {...register('email')} 
            type="email" 
            placeholder="name@example.com" 
            className={cn(
              "w-full h-10 px-3 bg-surface border-transparent hover:border-border focus:bg-white transition-all",
              errors.email && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            autoComplete="email"
          />
          {errors.email && <p className="text-[12px] text-danger mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-text-primary" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-[12px] text-text-secondary hover:text-text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password"
            {...register('password')} 
            type="password" 
            placeholder="••••••••" 
            className={cn(
              "w-full h-10 px-3 bg-surface border-transparent hover:border-border focus:bg-white transition-all",
              errors.password && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            autoComplete="current-password"
          />
          {errors.password && <p className="text-[12px] text-danger mt-1">{errors.password.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={login.isPending}
          className="w-full h-10 mt-2 bg-text-primary text-white hover:bg-text-primary/90 transition-all active:scale-[0.98] font-medium"
        >
          {login.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Sign in
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[13px] text-text-secondary">
          Don't have an account?{' '}
          <Link href="/register" className="text-text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
