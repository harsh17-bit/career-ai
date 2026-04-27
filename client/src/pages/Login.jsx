import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login } = useAuthStore();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data);
      toast.success('Welcome back!');
      navigate(res.data.assessmentCompleted ? '/dashboard' : '/assessment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    const email = form.email.trim();
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setForgotLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      navigate('/forgot-password', {
        state: { email, otpAlreadySent: true },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'No account found with this email address.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-login relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-xl"
      >
        <div
          className={`rounded-[28px] border p-6 sm:p-8 ${isDark
            ? 'border-white/10 bg-slate-950/75 shadow-[0_24px_80px_rgba(2,6,23,0.62)]'
            : 'border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]'
            }`}
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="site-header-name">Career.AI</span>
          </div>

          {/* <h1
            className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
              }`}
          >
            Sign in to continue
          </h1> */}
          {/* <p
            className={`mt-3 text-sm leading-6 ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Access your dashboard, assessment results, and roadmap.
          </p> */}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Input
              label="Email Address"
              type="email"
              tone={isDark ? 'dark' : 'light'}
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              tone={isDark ? 'dark' : 'light'}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />

            <div className="flex items-center justify-end text-sm">
              <button
                type="button"
                className={`font-medium ${form.email && form.email.trim() !== ''
                  ? isDark
                    ? 'text-cyan-300 cursor-pointer'
                    : 'text-blue-600 cursor-pointer'
                  : isDark
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-400 cursor-not-allowed'
                  }`}
                onClick={handleForgotPasswordClick}
                disabled={
                  !form.email || form.email.trim() === '' || forgotLoading
                }
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full !rounded-2xl"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <p
            className={`mt-8 text-center text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'
              }`}
          >
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className={`font-semibold ${isDark
                ? 'text-cyan-300 hover:text-cyan-200'
                : 'text-blue-600 hover:text-blue-700'
                }`}
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
