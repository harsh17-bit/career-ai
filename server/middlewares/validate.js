import { z } from 'zod';

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.errors?.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
};

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(10, 'Google credential is required'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'Verification code must be 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'Reset code must be 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[^A-Za-z0-9]/, 'Password must contain one special character'),
    resetToken: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    otp: z.string().length(6, 'Reset code must be 6 digits').optional(),
  })
  .refine(
    (data) =>
      Boolean(data.resetToken) || (Boolean(data.email) && Boolean(data.otp)),
    { message: 'Provide a reset token or the email and reset code.' }
  );

export const assessmentSchema = z.object({
  educationLevel: z.string().min(1),
  stream: z.string().min(1),
  marks: z.number().min(0).max(100),
  subjects: z.array(z.string()).min(1),
  interests: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  goals: z.string().min(1),
});

export default validate;
