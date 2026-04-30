import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Map,
  Search,
  Settings,
} from 'lucide-react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import BrandLogo from '../ui/BrandLogo';

const ModernCollapsibleSidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Layout, label: 'Dashboard', href: '/dashboard' },
    { icon: Map, label: 'Roadmap', href: '/roadmap' },
    { icon: Settings, label: 'Profile', href: '/profile' },
  ];

  const activeItem =
    menuItems.find((item) => location.pathname.startsWith(item.href))?.label ||
    'Dashboard';

  return (
    <div className="relative min-h-screen w-full pt-[var(--header-height)] bg-[var(--bg-base)] flex font-sans text-[var(--text-primary)] transition-colors duration-300">
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-[calc(100vh-var(--header-height))] sticky top-[var(--header-height)] py-2 pl-2 bg-[var(--bg-base)] border-r-0 flex flex-col z-20 transition-all duration-300"
      >
        <div className="h-full bg-[var(--bg-elevated)] border border-[var(--border-soft)] rounded-2xl flex flex-col shadow-sm relative overflow-visible transition-colors duration-300">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-9 h-7 w-7 rounded-full shadow-sm bg-[var(--bg-elevated)] flex items-center justify-center hover:bg-[var(--surface-soft)] z-30 border border-[var(--border-soft)] cursor-pointer focus:outline-none transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            )}
          </button>

          <div className="h-20 flex items-center px-6 border-b border-[var(--border-soft)]">
            <div className="flex items-center gap-3 group w-full">
              <BrandLogo
                to="/"
                label="Career.AI home"
                className="no-underline"
                textClassName="font-bold text-base tracking-tight text-[var(--text-primary)]"
                badgeClassName="h-9 w-9 rounded-xl"
                size={42}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                    className="flex flex-col overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-[var(--apple-blue)] font-medium">
                      Platform
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="px-4 py-4">
            {!isCollapsed ? (
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-[var(--text-muted)] z-10" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-10 text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] focus:outline-none focus:border-[var(--apple-blue)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-300"
                />
                {/* <div className="absolute right-2 px-1.5 rounded border border-[var(--border-soft)] bg-[var(--bg-elevated)] text-[10px] font-medium text-[var(--text-muted)] flex items-center justify-center h-5 transition-colors">⌘K</div> */}
              </div>
            ) : (
              <button className="w-10 h-10 mx-auto rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--surface-soft-hover)] flex items-center justify-center transition-colors">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            )}
          </div>

          <div className="flex-1 px-3 overflow-y-auto no-scrollbar">
            <div className="space-y-1 py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'w-full flex items-center justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                    activeItem === item.label
                      ? 'bg-[var(--apple-blue)] text-[var(--bg-base)] shadow-md'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isCollapsed ? 'mx-auto' : ''
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        'text-sm font-medium flex-1 text-left',
                        activeItem === item.label ? 'font-semibold' : ''
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-[var(--border-soft)] mt-auto flex flex-col gap-1 transition-colors duration-300">
            <button
              onClick={toggleTheme}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-soft)] transition-colors w-full cursor-pointer group',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <div className="w-9 h-9 rounded-full flex flex-shrink-0 items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--apple-blue)] overflow-hidden transition-all">
                {isDark ? (
                  <FiSun className="w-5 h-5" />
                ) : (
                  <FiMoon className="w-5 h-5" />
                )}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                  Toggle Theme
                </span>
              )}
            </button>

            <div
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-soft)] transition-colors cursor-pointer group',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <div className="w-9 h-9 rounded-full bg-[var(--surface-soft)] flex flex-shrink-0 items-center justify-center overflow-hidden transition-all">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {user?.name || 'Guest'}
                  </p>
                  <p className="text-xs text-[var(--apple-blue)] truncate">
                    {user?.profile?.stream || 'Ready!'}
                  </p>
                </motion.div>
              )}
              {!isCollapsed && (
                <LogOut
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                    navigate('/');
                  }}
                  className="w-4 h-4 text-[var(--text-muted)] hover:text-[#FF375F] transition-colors"
                />
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 relative py-2 px-2 flex flex-col">
        <div className="flex-1 w-full rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-soft)] relative transition-colors duration-300 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ModernCollapsibleSidebar;
