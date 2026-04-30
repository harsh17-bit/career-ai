import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import AuthSplitLayout from '../components/layout/AuthSplitLayout';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';
import useAuthStore from '../store/authStore';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
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
        sessionStorage.setItem(
          'pendingVerificationEmail',
          res.data.email || form.email
        );
        toast.success('Verification code sent to your email.');
        navigate('/verify-email', {
          state: {
            email: res.data.email || form.email,
          },
        });
        return;
      }

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      className="auth-page auth-page-signup"
      title="Create your account"
      description="Sign up to save your assessment, roadmap, and recommendations in one place."
      logoLabel="Career.AI home"
    >
      <div className="auth-title-block">
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-subtitle">
          Create your account and start with a structured career path.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form mt-8 space-y-5">
        <Input
          label="Full Name"
          type="text"
          tone="light"
          autoComplete="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          className="auth-input-shell"
        />

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
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          className="auth-input-shell"
        />

        <Input
          label="Confirm Password"
          type="password"
          tone="light"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          className="auth-input-shell"
        />

        <Button type="submit" className="w-full !rounded-xl" loading={loading}>
          Create account
        </Button>

        <GoogleSignInButton
          mode="signup"
          onSuccess={(data) => {
            login(data);
            navigate('/dashboard');
          }}
          className="pt-1"
        />

        <p className="auth-switch-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
