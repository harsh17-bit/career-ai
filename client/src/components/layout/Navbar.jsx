import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';

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
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-apple site-header-wrap">
        <div className="site-header-shell">
          <Link to="/" className="site-header-brand" aria-label="CareerAI home">
            {/* <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center transition-transform duration-300">
              <FiStar className="w-4 h-4 text-white" />
            </div> */}
            <span className="site-header-name">Career.AI</span>
          </Link>

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
              className="site-header-icon-btn"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="site-header-icon-btn"
                  onClick={() => navigate('/profile')}
                  aria-label="Profile"
                >
                  <FiUser />
                </button>
                <button
                  type="button"
                  className="site-header-deploy"
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="site-header-deploy"
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

        {mobileOpen && (
          <div className="site-header-mobile-panel">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                className="site-header-mobile-link"
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
              </button>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="site-header-mobile-link"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="site-header-mobile-link"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="site-header-mobile-link"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
