export {
  changePasswordSchema,
  loginRequestSchema as loginSchema,
  passwordResetRequestSchema,
  registerRequestSchema as registerSchema,
  resetPasswordSchema,
} from '@/lib/contracts/auth';

export type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/lib/contracts/auth';
