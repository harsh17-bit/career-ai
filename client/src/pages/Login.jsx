import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login } = useAuthStore();
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
      navigate('/dashboard');
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.requiresVerification
      ) {
        sessionStorage.setItem(
          'pendingVerificationEmail',
          err.response?.data?.email || form.email
        );
        toast.error('Verify your email to continue.');
        navigate('/verify-email', {
          state: {
            email: err.response?.data?.email || form.email,
          },
        });
        return;
      }

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
    <AuthSplitLayout
      className="auth-page auth-page-login"
      title="Welcome to your new dashboard"
      description="Sign in to explore changes we've made."
      logoLabel="Career.AI home"
    >
      <div className="auth-title-block">
        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          tone="light"
          autoComplete="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          className="auth-input-shell"
        />

        <Input
          label="Password"
          type="password"
          tone="light"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          className="auth-input-shell"
        />

        <div className="auth-login-row">
          {/* <label className="auth-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember for 30 days</span>
          </label> */}

          <button
            type="button"
            className="auth-forgot-link"
            onClick={handleForgotPasswordClick}
            disabled={!form.email || form.email.trim() === '' || forgotLoading}
          >
            Forgot password
          </button>
        </div>

        <Button type="submit" className="w-full !rounded-xl" loading={loading}>
          Sign in
        </Button>

        <GoogleSignInButton
          mode="signin"
          onSuccess={(data) => {
            login(data);
            navigate('/dashboard');
          }}
          className="pt-1"
        />

        <p className="auth-switch-link">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
