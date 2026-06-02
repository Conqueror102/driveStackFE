import {
  changePasswordSchema,
  passwordResetRequestResponseSchema,
  requestEmailVerificationResponseSchema,
  resetPasswordSchema,
  userSchema,
} from '@/lib/contracts/auth';
import { successSchema } from '@/lib/contracts/shared';
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  User,
} from '@/lib/contracts/auth';
import { apiFetch } from './client';
import { z } from 'zod';

const sessionResponseSchema = z.object({
  user: userSchema,
});

export const authApi = {
  login: (data: LoginInput) =>
    apiFetch<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: data,
      schema: sessionResponseSchema,
    }),

  register: (data: RegisterInput) =>
    apiFetch<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: data,
      schema: sessionResponseSchema,
    }),

  me: () =>
    apiFetch<User>('/api/auth/me', {
      schema: userSchema,
      suppressUnauthorizedRedirect: true,
    }),

  logout: () =>
    apiFetch('/api/auth/logout', {
      method: 'POST',
      schema: successSchema,
    }),

  requestEmailVerification: () =>
    apiFetch('/api/auth/email/request-verification', {
      method: 'POST',
      schema: requestEmailVerificationResponseSchema,
    }),

  verifyEmail: (token: string) =>
    apiFetch('/api/auth/email/verify', {
      method: 'POST',
      body: { token },
      schema: successSchema,
    }),

  requestPasswordReset: (email: string) =>
    apiFetch('/api/auth/password/request-reset', {
      method: 'POST',
      body: { email },
      schema: passwordResetRequestResponseSchema,
    }),

  resetPassword: (data: ResetPasswordInput) =>
    apiFetch('/api/auth/password/reset', {
      method: 'POST',
      body: resetPasswordSchema.parse(data),
      schema: successSchema,
    }),

  changePassword: (data: ChangePasswordInput) =>
    apiFetch('/api/auth/password/change', {
      method: 'POST',
      body: changePasswordSchema.parse(data),
      schema: successSchema,
    }),
};
