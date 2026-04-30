import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import EmailPreview from './pages/EmailPreview';
import useAuthStore from './store/authStore';
import { useTheme } from './context/ThemeContext';
import ModernCollapsibleSidebar from './components/lightswind/modern-collapsible-sidebar';
import FloatingDock from './components/lightswind/floating-dock';
import Antigravity from './components/ui/Antigravity';

const SIDEBAR_ROUTES = ['/dashboard', '/roadmap', '/profile'];
const AUTH_ROUTES = ['/login', '/signup', '/verify-email', '/forgot-password'];

function isPublicAuthRoute(pathname) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function getAntigravityPreset(pathname, isDark) {
  if (pathname === '/email-preview') {
    return {
      tone: 'soft',
      stageOpacity: 0.5,
      overlayOpacity: 0.92,
      props: {
        count: 220,
        magnetRadius: 5,
        ringRadius: 6,
        waveSpeed: 0.32,
        waveAmplitude: 0.55,
        particleSize: 1,
        lerpSpeed: 0.04,
        color: isDark ? '#8ab4ff' : '#4f46e5',
        autoAnimate: true,
        particleVariance: 0.85,
        rotationSpeed: 0.015,
        depthFactor: 0.8,
        pulseSpeed: 2.4,
        particleShape: 'capsule',
        fieldStrength: 12,
      },
    };
  }

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/verify-email')
  ) {
    return {
      tone: 'auth',
      stageOpacity: 0.58,
      overlayOpacity: 0.9,
      props: {
        count: 250,
        magnetRadius: 5.5,
        ringRadius: 6.5,
        waveSpeed: 0.36,
        waveAmplitude: 0.7,
        particleSize: 1.05,
        lerpSpeed: 0.042,
        color: isDark ? '#67e8f9' : '#2563eb',
        autoAnimate: true,
        particleVariance: 0.9,
        rotationSpeed: 0.02,
        depthFactor: 0.9,
        pulseSpeed: 2.7,
        particleShape: 'capsule',
        fieldStrength: 11,
      },
    };
  }

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/roadmap') ||
    pathname.startsWith('/profile')
  ) {
    return {
      tone: 'product',
      stageOpacity: 0.66,
      overlayOpacity: 0.86,
      props: {
        count: 300,
        magnetRadius: 6,
        ringRadius: 7,
        waveSpeed: 0.4,
        waveAmplitude: 0.82,
        particleSize: 1.15,
        lerpSpeed: 0.045,
        color: isDark ? '#93c5fd' : '#3b82f6',
        autoAnimate: true,
        particleVariance: 1,
        rotationSpeed: 0.026,
        depthFactor: 1,
        pulseSpeed: 3,
        particleShape: 'capsule',
        fieldStrength: 10,
      },
    };
  }

  if (pathname.startsWith('/assessment')) {
    return {
      tone: 'focus',
      stageOpacity: 0.62,
      overlayOpacity: 0.88,
      props: {
        count: 280,
        magnetRadius: 5.8,
        ringRadius: 7,
        waveSpeed: 0.38,
        waveAmplitude: 0.76,
        particleSize: 1.12,
        lerpSpeed: 0.044,
        color: isDark ? '#7dd3fc' : '#2563eb',
        autoAnimate: true,
        particleVariance: 0.96,
        rotationSpeed: 0.023,
        depthFactor: 0.95,
        pulseSpeed: 2.9,
        particleShape: 'capsule',
        fieldStrength: 10,
      },
    };
  }

  return {
    tone: 'landing',
    stageOpacity: 0.74,
    overlayOpacity: 0.84,
    props: {
      count: 360,
      magnetRadius: 6,
      ringRadius: 8,
      waveSpeed: 0.42,
      waveAmplitude: 0.9,
      particleSize: 1.25,
      lerpSpeed: 0.045,
      color: isDark ? '#7dd3fc' : '#3b82f6',
      autoAnimate: true,
      particleVariance: 1,
      rotationSpeed: 0.03,
      depthFactor: 1,
      pulseSpeed: 3,
      particleShape: 'capsule',
      fieldStrength: 10,
    },
  };
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppShell() {
  const { isDark } = useTheme();
  const location = useLocation();
  const isEmailPreviewRoute = location.pathname === '/email-preview';
  const isAuthRoute = isPublicAuthRoute(location.pathname);
  const isSidebarRoute = SIDEBAR_ROUTES.some((r) =>
    location.pathname.startsWith(r)
  );
  const antigravityPreset = getAntigravityPreset(location.pathname, isDark);

  const pageRoutes = (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route path="/email-preview" element={<EmailPreview />} />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <Assessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className="min-h-screen app-shell transition-colors duration-300">
      <div
        className="global-antigravity-bg"
        data-tone={antigravityPreset.tone}
        aria-hidden="true"
      >
        <div
          className="global-antigravity-stage"
          style={{ opacity: antigravityPreset.stageOpacity }}
        >
          <Antigravity {...antigravityPreset.props} />
        </div>
        <div
          className="global-antigravity-overlay"
          style={{ opacity: antigravityPreset.overlayOpacity }}
        />
      </div>

      <div className="app-shell-content">
        {!isEmailPreviewRoute && !isAuthRoute && <Navbar />}

        {isSidebarRoute ? (
          <ModernCollapsibleSidebar>{pageRoutes}</ModernCollapsibleSidebar>
        ) : (
          pageRoutes
        )}

        {!isEmailPreviewRoute && !isAuthRoute && <Footer />}
        {!isEmailPreviewRoute && !isAuthRoute && <Chatbot />}
        {!isEmailPreviewRoute && !isAuthRoute && <FloatingDock />}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark
                ? 'rgba(18, 18, 20, 0.95)'
                : 'rgba(255, 255, 255, 0.92)',
              color: isDark ? '#F5F5F7' : '#171717',
              backdropFilter: 'blur(20px)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.08)',
              borderRadius: '16px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#30D158', secondary: '#fff' } },
            error: { iconTheme: { primary: '#FF375F', secondary: '#fff' } },
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </Router>
  );
}
