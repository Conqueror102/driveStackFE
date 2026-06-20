'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { changePasswordSchema } from '@/lib/validations/auth.schema';
import { useChangePassword } from '@/hooks/use-auth';
import type { ChangePasswordInput } from '@/lib/contracts/auth';

export default function SettingsPage() {
  const changePassword = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword.mutateAsync(data);
      reset();
    } catch (error: any) {
      toast.error(error?.message || 'Unable to change password');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <section className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-accent-subtle text-accent flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-text-primary">Change password</h2>
            <p className="text-[13px] text-text-secondary mt-1">Changing your password invalidates your current session.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-primary" htmlFor="currentPassword">Current password</label>
            <Input id="currentPassword" type="password" autoComplete="current-password" {...register('currentPassword')} />
            {errors.currentPassword && <p className="text-[12px] text-danger">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-primary" htmlFor="newPassword">New password</label>
            <Input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} />
            {errors.newPassword && <p className="text-[12px] text-danger">{errors.newPassword.message}</p>}
          </div>

          <Button type="submit" disabled={changePassword.isPending} className="bg-text-primary text-white hover:bg-text-primary/90">
            {changePassword.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Change password
          </Button>
        </form>
      </section>
    </div>
  );
}
