import { z } from 'zod';

export const userStatusSchema = z.enum(['ACTIVE', 'DISABLED']);

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  emailVerified: z.boolean(),
  status: userStatusSchema,
  tokenVersion: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subscription: z.object({
    plan: z.enum(['FREE', 'PRO']),
    status: z.enum(['ACTIVE', 'ON_HOLD', 'CANCELLED', 'EXPIRED']),
    currentPeriodEnd: z.string().nullable(),
    gracePeriodEndsAt: z.string().nullable(),
  }).optional(),
});

export const loginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerRequestSchema = z
  .object({
    displayName: z.string().trim().optional(),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const backendRegisterRequestSchema = registerRequestSchema.transform(
  ({ confirmPassword, displayName, ...data }) => ({
    ...data,
    displayName: displayName || undefined,
  })
);

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export const requestEmailVerificationResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
});

export const verifyEmailRequestSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const passwordResetRequestResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginRequestSchema>;
export type RegisterInput = z.infer<typeof registerRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
