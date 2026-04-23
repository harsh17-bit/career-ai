import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { addNotification } from '../utils/notifications';

export default function ForgotPassword() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.email) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email: form.email });
      addNotification({
        type: 'otp',
        title: 'Reset code sent',
        description: 'Use the OTP to update your password securely.',
        href: '/forgot-password',
      });
      toast.success(res.data?.message || 'Reset code sent');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!form.otp || !form.newPassword) {
      toast.error('OTP and new password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(form);
      addNotification({
        type: 'otp',
        title: 'Password updated',
        description: 'Your password was reset successfully. Sign in again.',
        href: '/login',
      });
      toast.success(res.data?.message || 'Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-login relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_32%),linear-gradient(180deg,#07101d_0%,#0d1b2c_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        <div
          className={`rounded-[28px] border p-6 sm:p-8 ${
            isDark
              ? 'border-white/10 bg-slate-950/75 shadow-[0_24px_80px_rgba(2,6,23,0.62)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
          }`}
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.22em] ${
              isDark ? 'text-cyan-300/85' : 'text-blue-600/80'
            }`}
          >
            Account recovery
          </p>
          <h1
            className={`mt-3 text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Forgot Password
          </h1>
          <p
            className={`mt-3 text-sm leading-6 ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {step === 1
              ? 'Enter your email and we will send an OTP.'
              : 'Enter OTP and your new password to finish reset.'}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="mt-7 space-y-4">
              <Input
                label="Email"
                type="email"
                tone={isDark ? 'dark' : 'light'}
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Button
                type="submit"
                className="w-full !rounded-2xl"
                loading={loading}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
              <Input
                label="OTP"
                type="text"
                tone={isDark ? 'dark' : 'light'}
                value={form.otp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    otp: e.target.value.replace(/\D/g, '').slice(0, 6),
                  })
                }
              />
              <Input
                label="New Password"
                type="password"
                tone={isDark ? 'dark' : 'light'}
                autoComplete="new-password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full !rounded-2xl"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-full !rounded-2xl"
                  loading={loading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}

          <p
            className={`mt-8 text-center text-sm ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Back to{' '}
            <Link
              to="/login"
              className={`font-semibold ${
                isDark
                  ? 'text-cyan-300 hover:text-cyan-200'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
