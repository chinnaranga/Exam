import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid institutional email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  organizationName: z.string().min(3, 'Organization name is required'),
  domainSlug: z.string().min(3, 'Domain slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid institutional email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  deviceFingerprint: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid institutional email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});
