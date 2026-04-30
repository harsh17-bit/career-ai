import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiStar,
  FiSun,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../ui/BrandLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Roadmap', href: '/roadmap' },
      ]
    : [
        { label: 'Feature', href: '#features' },
        { label: 'WorkFlow', href: '#how-it-works' },
        { label: 'Testimonials', href: '#testimonials' },
      ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        // The homepage might need time to mount before scrolling,
        // but for now this works if they just navigate to /
        return;
      }
      const section = document.querySelector(href);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-apple site-header-wrap relative">
        <div className="site-header-shell">
          <BrandLogo
            to="/"
            label="Career.AI home"
            className="site-header-brand"
            textClassName="site-header-name"
            badgeClassName="h-9 w-9 rounded-xl"
            size={36}
          />

          <nav className="site-header-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="site-header-link"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="site-header-actions">
            <button
              type="button"
              className="site-header-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun /> : <FiMoon />}
            </button>

            <button
              type="button"
              className="site-header-icon-btn hidden md:inline-flex"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="site-header-icon-btn hidden md:inline-flex"
                  onClick={() => navigate('/profile')}
                  aria-label="Profile"
                >
                  <FiUser />
                </button>
                <button
                  type="button"
                  className="site-header-deploy hidden md:inline-flex"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="site-header-deploy hidden md:inline-flex"
                onClick={() => navigate('/login')}
              >
                <FiUser />
                Login
              </button>
            )}
          </div>

          <button
            type="button"
            className="site-header-mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute left-2 right-2 top-[calc(100%+12px)] p-3 rounded-3xl bg-[var(--bg-elevated)]/95 backdrop-blur-3xl border border-[var(--border-soft)] shadow-2xl flex flex-col gap-1 overflow-hidden z-50 lg:hidden"
            >
              <div className="flex flex-col p-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className="w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)] transition-colors"
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="w-[calc(100%-2rem)] h-px bg-[var(--border-soft)] mx-auto my-1" />

              <div className="flex flex-col p-1">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)] transition-colors"
                      onClick={() => {
                        navigate('/profile');
                        setMobileOpen(false);
                      }}
                    >
                      <FiUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-[#FF375F] hover:bg-[#FF375F]/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-1 rounded-2xl text-[15px] font-bold bg-[var(--text-primary)] text-[var(--bg-base)] transition-transform active:scale-95"
                    onClick={() => {
                      navigate('/login');
                      setMobileOpen(false);
                    }}
                  >
                    <FiUser className="w-4 h-4" />
                    Login / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
