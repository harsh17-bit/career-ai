import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layout, Map, GraduationCap, User, LogOut, LogIn } from "lucide-react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

const FloatingDock = () => {
    const { logout, isAuthenticated } = useAuthStore();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const items = [
        { id: "home", icon: Home, label: "Home", href: "/hero" },
        ...(isAuthenticated ? [
            { id: "dashboard", icon: Layout, label: "Dashboard", href: "/dashboard" },
            { id: "roadmap", icon: Map, label: "Roadmap", href: "/roadmap" },
            { id: "assessment", icon: GraduationCap, label: "Assessment", href: "/assessment" },
            { id: "profile", icon: User, label: "Profile", href: "/profile" },
        ] : [
            { id: "login", icon: User, label: "Login", href: "/login" },
        ]),
    ];

    const handleNavigation = (href) => {
        navigate(href);
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            <motion.div
                className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--bg-elevated)]/80 backdrop-blur-xl border border-[var(--border-soft)] shadow-2xl shadow-black/10 pointer-events-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {items.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));

                    return (
                        <div
                            key={item.id}
                            className="relative group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(item.id)}
                            onClick={() => handleNavigation(item.href)}
                        >
                            {hoveredIndex === item.id && (
                                <motion.div
                                    layoutId="dock-highlight"
                                    className="absolute inset-0 bg-[var(--surface-soft)] rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}

                            {/* Tooltip */}
                            <AnimatePresence>
                                {hoveredIndex === item.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute -top-12 left-1/2 px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg shadow-lg border border-[var(--border-soft)] whitespace-nowrap pointer-events-none"
                                    >
                                        {item.label}
                                        {/* Tooltip Arrow */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-elevated)] border-b border-r border-[var(--border-soft)] rotate-45" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={cn(
                                "w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 z-10 relative",
                                isActive ? "text-[var(--apple-blue)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                            )}>
                                <item.icon className="w-5 h-5" />
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-active-dot"
                                        className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--apple-blue)]"
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}

                <div className="w-[1px] h-8 bg-[var(--border-soft)] mx-1" />

                {/* Theme Toggle */}
                <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex('theme')}
                    onClick={toggleTheme}
                >
                    {hoveredIndex === 'theme' && (
                        <motion.div
                            layoutId="dock-highlight"
                            className="absolute inset-0 bg-[var(--surface-soft)] rounded-full -z-10"
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                    )}

                    <AnimatePresence>
                        {hoveredIndex === 'theme' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 10, x: "-50%" }}
                                transition={{ duration: 0.15 }}
                                className="absolute -top-12 left-1/2 px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg shadow-lg border border-[var(--border-soft)] whitespace-nowrap pointer-events-none"
                            >
                                {isDark ? "Light Mode" : "Dark Mode"}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-elevated)] border-b border-r border-[var(--border-soft)] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                        {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </div>
                </div>

                {/* Logout (if authenticated) */}
                {isAuthenticated && (
                    <div
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHoveredIndex('logout')}
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                    >
                        {hoveredIndex === 'logout' && (
                            <motion.div
                                layoutId="dock-highlight"
                                className="absolute inset-0 bg-[#FF375F]/10 rounded-full -z-10"
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            />
                        )}

                        <AnimatePresence>
                            {hoveredIndex === 'logout' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                                    exit={{ opacity: 0, y: 10, x: "-50%" }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute -top-12 left-1/2 px-3 py-1.5 bg-[#FF375F] text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
                                >
                                    Logout
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF375F] rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 text-[var(--text-secondary)] group-hover:text-[#FF375F]">
                            <LogOut className="w-5 h-5" />
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FloatingDock;
