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
import ForgotPassword from './pages/ForgotPassword';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import EmailPreview from './pages/EmailPreview';
import useAuthStore from './store/authStore';
import { useTheme } from './context/ThemeContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.assessmentCompleted ? '/dashboard' : '/assessment'}
        replace
      />
    );
  }
  return children;
}

function AppShell() {
  const { isDark } = useTheme();
  const location = useLocation();
  const isEmailPreviewRoute = location.pathname === '/email-preview';

  return (
    <div className="min-h-screen app-shell transition-colors duration-300">
      {!isEmailPreviewRoute && <Navbar />}

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

      {!isEmailPreviewRoute && <Footer />}
      {!isEmailPreviewRoute && <Chatbot />}

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
