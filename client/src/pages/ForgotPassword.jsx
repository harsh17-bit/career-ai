import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const emailFromLogin = location.state?.email || '';
  const otpAlreadySent = Boolean(location.state?.otpAlreadySent);
  const otpSentRef = useRef(false);

  const [step, setStep] = useState(emailFromLogin ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: emailFromLogin,
    otp: '',
    newPassword: '',
  });

  useEffect(() => {
    if (
      emailFromLogin &&
      step === 2 &&
      !otpSentRef.current &&
      !otpAlreadySent
    ) {
      otpSentRef.current = true;
      handleSendOtp(null, emailFromLogin);
    }
  }, [emailFromLogin, otpAlreadySent, step]);

  const handleSendOtp = async (e, emailToUse) => {
    if (e) e.preventDefault();
    const emailValue = emailToUse || form.email;
    if (!emailValue || emailValue.trim() === '') {
      toast.error('Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email: emailValue });
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
          {/* <p
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
          </p> */}

          {/* {step === 1 ? ( */}
          {/* // <form onSubmit={handleSendOtp} className="mt-7 space-y-4">
            //   <Input
            //     label="Email"
            //     type="email"
            //     tone={isDark ? 'dark' : 'light'}
            //     autoComplete="email"
            //     value={form.email}
            //     onChange={(e) => setForm({ ...form, email: e.target.value })}
            //   />
            //   <Button
            //     type="submit"
            //     className="w-full !rounded-2xl"
            //     loading={loading}
            //     disabled={!form.email || form.email.trim() === ''}
            //   >
            //     Send OTP
            //   </Button>
            // </form> */}

          <form onSubmit={handleResetPassword} className="mt-7 space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
              >
                Verification Code
              </label>
              <p
                className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                Enter the 6-digit code sent to your device.
              </p>
              <div className="flex items-center justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    inputMode="numeric"
                    value={form.otp[i] || ''}
                    onChange={(e) => {
                      const newOtp = form.otp.split('');
                      newOtp[i] = e.target.value.replace(/\D/g, '');
                      setForm({ ...form, otp: newOtp.join('').slice(0, 6) });
                      if (e.target.value && i < 2) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !form.otp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400 focus:outline-none'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-none'
                    }`}
                  />
                ))}
                <span
                  className={`text-2xl font-light ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  ·
                </span>
                {[3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    inputMode="numeric"
                    value={form.otp[i] || ''}
                    onChange={(e) => {
                      const newOtp = form.otp.split('');
                      newOtp[i] = e.target.value.replace(/\D/g, '');
                      setForm({ ...form, otp: newOtp.join('').slice(0, 6) });
                      if (e.target.value && i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !form.otp[i] && i > 3) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-400 focus:outline-none'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:outline-none'
                    }`}
                  />
                ))}
              </div>
            </div>
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
              {/* <Button
                type="button"
                variant="ghost"
                className="w-full !rounded-2xl"
                onClick={() => setStep(1)}
              >
                Back
              </Button> */}
              <Button
                type="submit"
                className="w-full !rounded-2xl"
                loading={loading}
              >
                Update Password
              </Button>
            </div>
          </form>

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
