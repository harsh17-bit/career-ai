import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiStar,
  FiLogOut,
  FiUser,
  FiGrid,
  FiMoon,
  FiSun,
  FiBell,
  FiCheckCircle,
  FiBookOpen,
  FiAlertCircle,
} from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { roadmapAPI } from '../../services/api';
import {
  addNotification,
  getNotifications,
  markAllNotificationsRead,
  subscribeNotifications,
} from '../../utils/notifications';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  }, [location]);

  useEffect(() => {
    const syncNotifications = () => setNotifications(getNotifications());
    syncNotifications();
    return subscribeNotifications(syncNotifications);
  }, []);

  useEffect(() => {
    const fetchReminder = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await roadmapAPI.getUserRoadmaps();
        const activeRoadmap = res.data?.[0];
        if (!activeRoadmap) return;

        const incompletePhases =
          activeRoadmap.phases?.filter((phase) => !phase.completed)?.length ||
          0;

        if (incompletePhases > 0) {
          addNotification({
            type: 'reminder',
            title: 'Roadmap reminder',
            description: `${incompletePhases} phase${
              incompletePhases === 1 ? '' : 's'
            } left in ${activeRoadmap.career}.`,
            href: '/roadmap',
            dedupeKey: `roadmap-reminder-${activeRoadmap._id}`,
          });
        }
      } catch {
        // Silent fallback for navbar reminders.
      }
    };

    fetchReminder();
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter((item) => !item.read).length;
  const recentNotifications = notifications.slice(0, 4);

  const handleOpenNotifications = () => {
    setNotificationOpen((open) => !open);
    markAllNotificationsRead();
  };

  const getIcon = (type) => {
    if (type === 'otp') return FiAlertCircle;
    if (type === 'roadmap') return FiBookOpen;
    if (type === 'milestone') return FiCheckCircle;
    return FiBell;
  };

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Roadmap', href: '/roadmap' },
      ]
    : [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Testimonials', href: '#testimonials' },
      ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`navbar-root fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/50'
            : 'bg-transparent'
        }`}
      >
        <div className="container-apple flex items-center justify-between h-16 md:h-[72px] px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Career<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href
                    ? 'text-white bg-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FiSun className="w-4 h-4 text-white/80" />
              ) : (
                <FiMoon className="w-4 h-4 text-white/80" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={handleOpenNotifications}
                    className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    aria-label="Open notifications"
                  >
                    <FiBell className="w-4 h-4 text-white/80" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 overflow-hidden glass-card rounded-2xl border border-white/10"
                      >
                        <div className="border-b border-white/10 px-4 py-3">
                          <p className="text-sm font-semibold text-white">
                            Notifications
                          </p>
                          <p className="text-xs text-white/40">
                            OTPs, roadmap updates, and reminders
                          </p>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-2">
                          {recentNotifications.length > 0 ? (
                            recentNotifications.map((item) => {
                              const Icon = getIcon(item.type);

                              return (
                                <Link
                                  key={item.id}
                                  to={item.href || '/dashboard'}
                                  onClick={() => setNotificationOpen(false)}
                                  className="flex items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                                >
                                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 border border-white/10">
                                    <Icon className="h-4 w-4 text-apple-blue" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="truncate text-sm font-medium text-white">
                                        {item.title}
                                      </p>
                                      {!item.read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                                      )}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-white/50">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })
                          ) : (
                            <div className="px-3 py-8 text-center text-sm text-white/40">
                              No notifications yet.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl p-2 border border-white/10"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <FiUser className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <FiGrid className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <hr className="border-white/10 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all text-white"
          >
            {mobileOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
              data-navbar-mobile-overlay="true"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-apple-gray-900/95 backdrop-blur-2xl border-l border-white/10 p-8 pt-24"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={toggleTheme}
                  className="text-left px-5 py-4 rounded-2xl text-lg font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  {isDark ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="text-left px-5 py-4 rounded-2xl text-lg font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <hr className="border-white/10 my-6" />
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block px-5 py-4 rounded-2xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button variant="secondary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" className="block">
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
