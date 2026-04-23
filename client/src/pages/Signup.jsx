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
    <div className="auth-page auth-page-signup relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_32%),linear-gradient(180deg,#07101d_0%,#0d1b2c_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]'
        }`}
      />
      <div
        className={`absolute left-[-6rem] top-24 h-72 w-72 rounded-full blur-3xl ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-500/15'
        }`}
      />
      <div
        className={`absolute bottom-10 right-[-5rem] h-80 w-80 rounded-full blur-3xl ${
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
          className={`rounded-[28px] border p-6 sm:p-8 ${
            isDark
              ? 'border-white/10 bg-slate-950/75 shadow-[0_24px_80px_rgba(2,6,23,0.62)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f6ef7_0%,#3858e8_100%)]">
              <FiStar className="h-5 w-5 text-[#f4f8ff]" />
            </div>
            <span
              className={`text-2xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Career
              <span className={isDark ? 'text-cyan-300' : 'text-blue-600'}>
                AI
              </span>
            </span>
          </div>

          <h1
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
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
              <FiArrowRight className="h-5 w-5" />
            </Button>
          </form>

          <p
            className={`mt-8 text-center text-sm ${
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
