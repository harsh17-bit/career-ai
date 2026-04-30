import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMail } from 'react-icons/fi';
import Button from '../components/ui/Button';
import VerificationCodeInput from '../components/ui/VerificationCodeInput';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { addNotification } from '../utils/notifications';

const OTP_LENGTH = 6;

export default function VerifyEmail() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const email =
    location.state?.email ||
    sessionStorage.getItem('pendingVerificationEmail') ||
    '';
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const canSubmit = otp.length === OTP_LENGTH && !verifying;

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error('No email address was provided for verification.');
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      toast.error('Enter the 6-digit verification code.');
      return;
    }

    setVerifying(true);
    try {
      const res = await authAPI.verifyOtp({ email, otp });
      sessionStorage.removeItem('pendingVerificationEmail');
      login(res.data);
      addNotification({
        type: 'otp',
        title: 'Email verified',
        description: 'Your account is ready to use.',
        href: '/dashboard',
      });
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      toast.error(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('No email address was provided for verification.');
      return;
    }

    setResending(true);
    try {
      const res = await authAPI.resendOtp({ email });
      toast.success(res.data?.message || 'Verification code resent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page auth-page-login relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_32%),linear-gradient(180deg,#07101d_0%,#0d1b2c_100%)]'
            : 'bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)]'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        <div
          className={`rounded-[28px] border p-6 sm:p-8 ${
            isDark
              ? 'border-white/10 bg-slate-950/75 shadow-[0_24px_80px_rgba(2,6,23,0.62)]'
              : 'border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
              <FiMail className="h-6 w-6 text-slate-700 dark:text-white/80" />
            </div>
            <h1
              className={`mt-6 text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Check your email
            </h1>
            <p
              className={`mt-3 max-w-md text-sm leading-6 ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              We sent a 6-digit verification code to
              <span className="block font-semibold text-slate-900 dark:text-white">
                {email || 'your email address'}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            <VerificationCodeInput
              value={otp}
              length={OTP_LENGTH}
              onChange={setOtp}
              className="justify-center"
            />

            <Button
              type="submit"
              className="w-full !rounded-2xl"
              loading={verifying}
              disabled={!canSubmit || !email}
            >
              Verify email
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <p
              className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}
            >
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !email}
                className={`font-semibold ${
                  isDark
                    ? 'text-cyan-300 hover:text-cyan-200 disabled:text-slate-500'
                    : 'text-blue-600 hover:text-blue-700 disabled:text-slate-400'
                } disabled:cursor-not-allowed`}
              >
                {resending ? 'Resending...' : 'Resend code'}
              </button>
            </p>

            <Link
              to="/login"
              className={`inline-flex items-center gap-2 text-sm font-semibold ${
                isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiCheckCircle className="h-4 w-4" />
              Back to log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
