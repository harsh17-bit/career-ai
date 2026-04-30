import express from 'express';
import {
  signup,
  verifyOtp,
  resendOtp,
  verifyResetOtp,
  forgotPassword,
  resetPassword,
  login,
  googleAuth,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import protect from '../middlewares/auth.js';
import validate, {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from '../middlewares/validate.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post(
  '/verify-reset-otp',
  validate(verifyResetOtpSchema),
  verifyResetOtp
);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/google', validate(googleAuthSchema), googleAuth);
router.post('/login', validate(loginSchema), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
