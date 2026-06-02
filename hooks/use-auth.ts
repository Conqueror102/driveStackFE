import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth.api';
import { ApiClientError } from '@/lib/api/client';
import { QUERY_KEYS } from '@/lib/constants/query-keys';
import { useAuthStore } from '@/stores/auth.store';
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/lib/contracts/auth';

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
    if (query.error instanceof ApiClientError && query.error.status === 401) setUser(null);
  }, [query.data, query.error, setUser]);

  return query;
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.auth.me(), user);
      router.push('/overview');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.setQueryData(QUERY_KEYS.auth.me(), user);
      router.push(user.emailVerified ? '/overview' : '/verify-email');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: authApi.requestEmailVerification,
    onSuccess: () => toast.success('Verification email sent'),
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordInput) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset. Sign in with your new password.');
      router.push('/login');
    },
  });
}

export function useChangePassword() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed. Please sign in again.');
      clearSession();
      queryClient.clear();
      router.push('/login');
    },
  });
}
