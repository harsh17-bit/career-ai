import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiStar, FiUser } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import OtpVerificationModal from '../components/ui/OtpVerificationModal';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { addNotification } from '../utils/notifications';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationExpiresAt, setVerificationExpiresAt] = useState(null);
  const { login } = useAuthStore();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2)
      errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password || form.password.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.signup({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res.data?.requiresVerification) {
        setVerificationEmail(res.data.email || form.email);
        setVerificationExpiresAt(
          new Date(Date.now() + 10 * 60 * 1000).toISOString()
        );
        setVerificationOpen(true);
        addNotification({
          type: 'otp',
          title: 'Verification code sent',
          description: 'Check your inbox to verify your new account.',
          href: '/signup',
        });
        toast.success('Verification code sent to your email.');
        return;
      }

      login(res.data);
      toast.success('Account created successfully!');
      navigate('/assessment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setVerifying(true);
    try {
      const res = await authAPI.verifyOtp({
        email: verificationEmail,
        otp,
      });
      login(res.data);
      addNotification({
        type: 'otp',
        title: 'Email verified',
        description: 'Your account is ready and you can start the assessment.',
        href: '/assessment',
      });
      toast.success('Email verified successfully!');
      setVerificationOpen(false);
      navigate('/assessment');
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      toast.error(message);

      if (err.response?.data?.expired) {
        setVerificationExpiresAt(
          new Date(Date.now() + 10 * 60 * 1000).toISOString()
        );
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await authAPI.resendOtp({ email: verificationEmail });
      setVerificationExpiresAt(
        new Date(Date.now() + 10 * 60 * 1000).toISOString()
      );
      toast.success(res.data?.message || 'Verification code resent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  const closeVerificationModal = () => {
    if (verifying || resending) return;
    setVerificationOpen(false);
  };

  return (
    <div className="auth-page auth-page-signup relative min-h-screen overflow-hidden px-3 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8">
      <div
        className={`absolute left-[-5rem] top-16 h-52 w-52 rounded-full blur-3xl sm:left-[-6rem] sm:top-24 sm:h-72 sm:w-72 ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-500/15'
        }`}
      />
      <div
        className={`absolute bottom-4 right-[-4rem] h-56 w-56 rounded-full blur-3xl sm:bottom-10 sm:right-[-5rem] sm:h-80 sm:w-80 ${
          isDark ? 'bg-cyan-400/16' : 'bg-cyan-400/12'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        <div
          className={`rounded-[24px] border p-4 sm:rounded-[28px] sm:p-8 ${
            isDark
              ? 'border-white/10 bg-slate-950/75 shadow-[0_24px_80px_rgba(2,6,23,0.62)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="mb-5 flex items-center justify-center gap-2 sm:mb-6">
            <span className="site-header-name">Career.AI</span>
          </div>

          {/* <h1
            className={`text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Create your account
          </h1>
          <p
            className={`mt-3 text-sm leading-6 ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Sign up to save your assessment, roadmap, and recommendations in one
            place.
          </p> */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-3.5 sm:mt-7 sm:space-y-4"
          >
            <Input
              label="Full Name"
              type="text"
              icon={FiUser}
              tone={isDark ? 'dark' : 'light'}
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Email Address"
              type="email"
              icon={FiMail}
              tone={isDark ? 'dark' : 'light'}
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              icon={FiLock}
              tone={isDark ? 'dark' : 'light'}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={FiLock}
              tone={isDark ? 'dark' : 'light'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              className="w-full !rounded-2xl"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <p
            className={`mt-6 text-center text-xs sm:mt-8 sm:text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-semibold ${
                isDark
                  ? 'text-cyan-300 hover:text-cyan-200'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <OtpVerificationModal
        isOpen={verificationOpen}
        email={verificationEmail}
        expiresAt={verificationExpiresAt}
        verifying={verifying}
        resending={resending}
        onClose={closeVerificationModal}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
}
