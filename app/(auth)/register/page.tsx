'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/validations/auth.schema';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegister } from '@/hooks/use-auth';

export default function RegisterPage() {
  const registerUser = useRegister();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const password = watch('password', '');
  
  // Simple password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };
  
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser.mutateAsync({
        ...data,
        ...(refCode ? { referralCode: refCode } : {}),
      } as any);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create account');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">Create an account</h2>
        <p className="text-[14px] text-text-secondary">Get started with DriveStack for free.</p>
      </div>

      {refCode && (
        <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-[12px] text-green-700">
            You were referred by a DriveStack user. You'll both benefit when you upgrade to Pro.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-primary" htmlFor="displayName">Full name</label>
          <Input 
            id="displayName"
            {...register('displayName')} 
            placeholder="Victor Onyemaechi" 
            className={cn(
              "w-full h-10 px-3 bg-surface border-transparent hover:border-border focus:bg-white transition-all",
              errors.displayName && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            autoComplete="name"
          />
          {errors.displayName && <p className="text-[12px] text-danger mt-1">{errors.displayName.message}</p>}
        </div>

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
          <label className="text-[13px] font-medium text-text-primary" htmlFor="password">Password</label>
          <Input 
            id="password"
            {...register('password')} 
            type="password" 
            placeholder="Create a strong password" 
            className={cn(
              "w-full h-10 px-3 bg-surface border-transparent hover:border-border focus:bg-white transition-all",
              errors.password && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            autoComplete="new-password"
          />
          
          {/* Password strength indicator */}
          {password && !errors.password && (
            <div className="flex items-center gap-1 mt-2">
              <div className="h-1 flex-1 rounded-full bg-surface overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-300",
                    strength <= 25 ? "bg-danger" : strength <= 50 ? "bg-warning" : strength <= 75 ? "bg-blue-400" : "bg-success"
                  )} 
                  style={{ width: `${strength}%` }} 
                />
              </div>
              <span className="text-[10px] font-medium text-text-tertiary w-12 text-right">
                {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
              </span>
            </div>
          )}
          
          {errors.password && <p className="text-[12px] text-danger mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-primary" htmlFor="confirmPassword">Confirm password</label>
          <Input 
            id="confirmPassword"
            {...register('confirmPassword')} 
            type="password" 
            placeholder="Confirm your password" 
            className={cn(
              "w-full h-10 px-3 bg-surface border-transparent hover:border-border focus:bg-white transition-all",
              errors.confirmPassword && "border-danger focus:border-danger focus:ring-danger/20"
            )}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="text-[12px] text-danger mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={registerUser.isPending}
          className="w-full h-10 mt-4 bg-text-primary text-white hover:bg-text-primary/90 transition-all active:scale-[0.98] font-medium"
        >
          {registerUser.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[13px] text-text-secondary">
          By continuing, you agree to our <Link href="#" className="text-text-primary underline">Terms</Link> and <Link href="#" className="text-text-primary underline">Privacy Policy</Link>.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[13px] text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

