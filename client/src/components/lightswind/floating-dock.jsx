import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layout, Map, GraduationCap, User, LogOut } from "lucide-react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { Dock, DockIcon, DockSeparator } from "./apple-dock";

const FloatingDock = () => {
    const { logout, isAuthenticated } = useAuthStore();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Using the items that match the user's current logic, 
    // but styled exactly like the Lightswind apple-dock component photo.
    const items = [
        { id: "home", icon: Home, label: "Home", href: "/" },
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
            <Dock>
                {items.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
                    
                    return (
                        <DockIcon
                            key={item.id}
                            onClick={() => handleNavigation(item.href)}
                            onMouseEnter={() => setHoveredIndex(item.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={isActive ? "text-[var(--apple-blue)]" : "text-zinc-600 dark:text-zinc-400"}
                        >
                            <AnimatePresence>
                                {hoveredIndex === item.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute -top-12 left-1/2 px-2.5 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg shadow-md border border-[var(--border-soft)] whitespace-nowrap pointer-events-none"
                                    >
                                        {item.label}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-elevated)] border-b border-r border-[var(--border-soft)] rotate-45" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <item.icon className="w-[45%] h-[45%]" />
                            {isActive && (
                                <motion.div
                                    layoutId="dock-active-dot"
                                    className="absolute bottom-[15%] w-1 h-1 rounded-full bg-[var(--apple-blue)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                        </DockIcon>
                    );
                })}

                <DockSeparator />

                <DockIcon
                    onClick={toggleTheme}
                    onMouseEnter={() => setHoveredIndex('theme')}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="text-zinc-600 dark:text-zinc-400"
                >
                    <AnimatePresence>
                        {hoveredIndex === 'theme' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 10, x: "-50%" }}
                                transition={{ duration: 0.15 }}
                                className="absolute -top-12 left-1/2 px-2.5 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-semibold rounded-lg shadow-md border border-[var(--border-soft)] whitespace-nowrap pointer-events-none"
                            >
                                {isDark ? "Light Mode" : "Dark Mode"}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--bg-elevated)] border-b border-r border-[var(--border-soft)] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {isDark ? <FiSun className="w-[45%] h-[45%]" /> : <FiMoon className="w-[45%] h-[45%]" />}
                </DockIcon>

                {isAuthenticated && (
                    <DockIcon
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        onMouseEnter={() => setHoveredIndex('logout')}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="text-zinc-600 dark:text-zinc-400 hover:text-[#FF375F] dark:hover:text-[#FF375F]"
                    >
                        <AnimatePresence>
                            {hoveredIndex === 'logout' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                                    exit={{ opacity: 0, y: 10, x: "-50%" }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute -top-12 left-1/2 px-2.5 py-1.5 bg-[#FF375F] text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap pointer-events-none"
                                >
                                    Logout
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF375F] rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <LogOut className="w-[45%] h-[45%]" />
                    </DockIcon>
                )}
            </Dock>
        </div>
    );
};

export default FloatingDock;
