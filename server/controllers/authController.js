import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { generateOtp, hashOtp } from '../utils/otp.js';
import jwt from 'jsonwebtoken';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetOtpEmail,
} from '../utils/mailer.js';

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_EXPIRY_MINUTES = 10;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  assessmentCompleted: user.assessmentCompleted,
  profile: user.profile,
  careerRecommendations: user.careerRecommendations,
  token: generateToken(user._id),
});

const issueVerificationCode = async (user) => {
  const otp = generateOtp();

  user.emailVerificationOtpHash = hashOtp(otp);
  user.emailVerificationExpiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  user.emailVerificationAttempts = 0;
  await user.save();

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    otp,
  });
};

const issuePasswordResetCode = async (user) => {
  const otp = generateOtp();

  user.passwordResetOtpHash = hashOtp(otp);
  user.passwordResetExpiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  user.passwordResetAttempts = 0;
  await user.save();

  await sendPasswordResetOtpEmail({
    to: user.email,
    name: user.name,
    otp,
  });
};

const buildPasswordResetToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      purpose: 'password-reset',
    },
    process.env.JWT_SECRET,
    { expiresIn: `${RESET_TOKEN_EXPIRY_MINUTES}m` }
  );

const verifyGoogleCredential = async (credential) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      credential
    )}`
  );

  if (!response.ok) {
    throw new Error('Invalid Google credential');
  }

  const payload = await response.json();

  if (!payload?.email || !payload?.sub) {
    throw new Error('Invalid Google credential payload');
  }

  if (GOOGLE_CLIENT_ID && payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error('Google credential audience mismatch');
  }

  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    throw new Error('Google email is not verified');
  }

  return payload;
};

const buildGoogleUserPayload = (user) => buildAuthPayload(user);

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        await issueVerificationCode(existingUser);
        return res.status(200).json({
          message: 'Verification code sent to your email address.',
          email: existingUser.email,
          requiresVerification: true,
        });
      }

      return res.status(400).json({
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
    });

    await issueVerificationCode(user);

    return res.status(200).json({
      message: 'Verification code sent to your email address.',
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const payload = await verifyGoogleCredential(credential);

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const displayName =
      payload.name || payload.given_name || email.split('@')[0];
    const avatar = payload.picture || '';

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        password: `${googleId}-${Date.now()}`,
        googleId,
        authProvider: 'google',
        avatar,
        isEmailVerified: true,
      });
    } else {
      user.name = user.name || displayName;
      user.email = email;
      user.googleId = googleId;
      user.authProvider = 'google';
      user.avatar = avatar || user.avatar;
      user.isEmailVerified = true;
      await user.save();
    }

    return res.status(200).json(buildGoogleUserPayload(user));
  } catch (error) {
    return res.status(401).json({
      message: error.message || 'Google sign-in failed',
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(200).json(buildAuthPayload(user));
    }

    if (
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: 'Verification code expired. Please request a new one.',
        expired: true,
      });
    }

    if (user.emailVerificationAttempts >= 5) {
      return res.status(429).json({
        message: 'Too many invalid attempts. Please request a new code.',
      });
    }

    if (hashOtp(otp) !== user.emailVerificationOtpHash) {
      user.emailVerificationAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isEmailVerified = true;
    user.emailVerificationOtpHash = '';
    user.emailVerificationExpiresAt = null;
    user.emailVerificationAttempts = 0;
    await user.save();

    try {
      await sendWelcomeEmail({ to: user.email, name: user.name });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError.message);
    }

    return res.status(200).json(buildAuthPayload(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    await issueVerificationCode(user);

    return res.status(200).json({
      message: 'Verification code resent to your email address.',
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: 'Reset code expired. Please request a new one.',
        expired: true,
      });
    }

    if (user.passwordResetAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: 'Too many invalid attempts. Please request a new code.',
      });
    }

    if (hashOtp(otp) !== user.passwordResetOtpHash) {
      user.passwordResetAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    const resetToken = buildPasswordResetToken(user);

    user.passwordResetOtpHash = '';
    user.passwordResetExpiresAt = null;
    user.passwordResetAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: 'Reset code verified successfully.',
      email: user.email,
      resetToken,
      expiresIn: RESET_TOKEN_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before signing in.',
        requiresVerification: true,
        email: user.email,
      });
    }

    return res.json(buildAuthPayload(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.profile) {
      user.profile = { ...user.profile.toObject(), ...req.body.profile };
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profile: updatedUser.profile,
      assessmentCompleted: updatedUser.assessmentCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email address.',
      });
    }

    await issuePasswordResetCode(user);

    return res.status(200).json({
      message: 'Password reset code sent to your email address.',
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, email, otp, newPassword } = req.body;

    if (resetToken) {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

      if (decoded.purpose !== 'password-reset') {
        return res.status(400).json({ message: 'Invalid reset token' });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        message: 'Password reset successful. You can now sign in.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: 'Reset code expired. Please request a new one.',
        expired: true,
      });
    }

    if (user.passwordResetAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: 'Too many invalid attempts. Please request a new code.',
      });
    }

    if (hashOtp(otp) !== user.passwordResetOtpHash) {
      user.passwordResetAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    user.password = newPassword;
    user.passwordResetOtpHash = '';
    user.passwordResetExpiresAt = null;
    user.passwordResetAttempts = 0;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successful. You can now sign in.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
