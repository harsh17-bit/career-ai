import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import BrandLogo from '../components/ui/BrandLogo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import VerificationCodeInput from '../components/ui/VerificationCodeInput';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { addNotification } from '../utils/notifications';

const PASSWORD_RULES = [
  {
    label: 'Must be at least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    label: 'Must contain one special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

const getInitialStep = (email, hasToken) => {
  if (hasToken) return 'reset';
  if (email) return 'verify';
  return 'request';
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromLogin = location.state?.email || '';
  const otpAlreadySent = Boolean(location.state?.otpAlreadySent);
  const storedToken = sessionStorage.getItem('pendingResetToken') || '';
  const storedEmail = sessionStorage.getItem('pendingResetEmail') || '';

  const [step, setStep] = useState(
    getInitialStep(emailFromLogin || storedEmail, Boolean(storedToken))
  );
  const [loading, setLoading] = useState({
    request: false,
    verify: false,
    reset: false,
  });
  const [form, setForm] = useState({
    email: emailFromLogin || storedEmail,
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetToken, setResetToken] = useState(storedToken);
  const otpSentRef = useRef(false);

  const passwordChecks = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    valid: rule.test(form.newPassword),
  }));

  const canReset =
    form.newPassword.length >= 8 &&
    /[^A-Za-z0-9]/.test(form.newPassword) &&
    form.newPassword === form.confirmPassword &&
    Boolean(resetToken);

  useEffect(() => {
    if (
      step === 'verify' &&
      form.email &&
      !otpAlreadySent &&
      !otpSentRef.current
    ) {
      otpSentRef.current = true;
      void handleSendCode(null, form.email);
    }
  }, [step, form.email, otpAlreadySent]);

  const handleSendCode = async (event, emailToUse) => {
    if (event) event.preventDefault();

    const emailValue = (emailToUse || form.email).trim();
    if (!emailValue) {
      toast.error('Please enter your email address first');
      return;
    }

    setLoading((current) => ({ ...current, request: true }));
    try {
      const res = await authAPI.forgotPassword({ email: emailValue });
      sessionStorage.setItem('pendingResetEmail', emailValue);
      addNotification({
        type: 'otp',
        title: 'Reset code sent',
        description: 'Use the code to verify your password reset request.',
        href: '/forgot-password',
      });
      toast.success(res.data?.message || 'Reset code sent');
      setForm((current) => ({ ...current, email: emailValue, otp: '' }));
      setStep('verify');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading((current) => ({ ...current, request: false }));
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();

    if (!form.email || !form.otp) {
      toast.error('Email and reset code are required');
      return;
    }

    setLoading((current) => ({ ...current, verify: true }));
    try {
      const res = await authAPI.verifyResetOtp({
        email: form.email,
        otp: form.otp,
      });

      const nextToken = res.data?.resetToken;
      if (!nextToken) {
        throw new Error('Reset verification did not return a token');
      }

      setResetToken(nextToken);
      sessionStorage.setItem('pendingResetToken', nextToken);
      sessionStorage.setItem('pendingResetEmail', form.email);
      setStep('reset');
      toast.success(res.data?.message || 'Reset code verified');
    } catch (err) {
      if (err.response?.data?.expired) {
        sessionStorage.removeItem('pendingResetToken');
        setResetToken('');
        setStep('request');
      }
      toast.error(err.response?.data?.message || 'Invalid reset code');
    } finally {
      setLoading((current) => ({ ...current, verify: false }));
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!canReset) {
      toast.error('Enter a valid password and confirm it');
      return;
    }

    setLoading((current) => ({ ...current, reset: true }));
    try {
      const res = await authAPI.resetPassword({
        resetToken,
        newPassword: form.newPassword,
      });

      sessionStorage.removeItem('pendingResetToken');
      sessionStorage.removeItem('pendingResetEmail');
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
      setLoading((current) => ({ ...current, reset: false }));
    }
  };

  const renderRequestStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <FiMail className="h-6 w-6 text-slate-700 dark:text-white/80" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Forgot password
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">
          Enter your email and we&apos;ll send a reset code so you can continue.
        </p>
      </div>

      <form
        onSubmit={(event) => handleSendCode(event)}
        className="mt-8 space-y-6"
      >
        <Input
          label="Email"
          type="email"
          tone="light"
          autoComplete="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="auth-input-shell"
        />

        <Button
          type="submit"
          className="w-full !rounded-2xl"
          loading={loading.request}
          disabled={!form.email.trim()}
        >
          Send reset code
        </Button>
      </form>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <FiMail className="h-6 w-6 text-slate-700 dark:text-white/80" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Check your email
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">
          We sent a 6-digit reset code to
          <span className="block font-semibold text-slate-900 dark:text-white">
            {form.email || 'your email address'}
          </span>
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="mt-8 space-y-6">
        <VerificationCodeInput
          value={form.otp}
          length={6}
          onChange={(otp) => setForm({ ...form, otp })}
          className="justify-center"
        />

        <Button
          type="submit"
          className="w-full !rounded-2xl"
          loading={loading.verify}
          disabled={form.otp.length !== 6}
        >
          Verify code
        </Button>

        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <button
            type="button"
            onClick={() => handleSendCode(null, form.email)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-300 dark:hover:text-cyan-200"
            disabled={loading.request}
          >
            Resend code
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('pendingResetToken');
              setResetToken('');
              setStep('request');
            }}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            Change email
          </button>
        </div>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <FiLock className="h-6 w-6 text-slate-700 dark:text-white/80" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Set new password
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
        <Input
          label="Password"
          type="password"
          tone="light"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(event) =>
            setForm({ ...form, newPassword: event.target.value })
          }
          className="auth-input-shell"
        />

        <Input
          label="Confirm password"
          type="password"
          tone="light"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(event) =>
            setForm({ ...form, confirmPassword: event.target.value })
          }
          className="auth-input-shell"
        />

        <div className="space-y-3 pt-1">
          {passwordChecks.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300"
            >
              <FiCheckCircle
                className={`h-5 w-5 ${
                  item.valid
                    ? 'text-emerald-500'
                    : 'text-slate-300 dark:text-white/35'
                }`}
              />
              <span className="text-sm leading-6">{item.label}</span>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full !rounded-2xl"
          loading={loading.reset}
          disabled={!canReset}
        >
          Reset password
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to log in
        </Link>
      </div>
    </>
  );

  return (
    <div className="auth-page auth-page-login relative min-h-screen overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:px-8">
          <div className="flex justify-center">
            <BrandLogo
              to="/"
              label="Career.AI home"
              className="justify-center"
              textClassName="text-slate-900 text-lg"
              badgeClassName="h-11 w-11 rounded-[14px]"
              size={50}
            />
          </div>

          <div className="mt-8">
            {step === 'request' && renderRequestStep()}
            {step === 'verify' && renderVerifyStep()}
            {step === 'reset' && renderResetStep()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
