import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    PlusCircle,
    Car,
    RefreshCw,
    Inbox,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Settings,
    Sparkles,
    MessageCircle,
    ArrowLeftRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import logo from '../assets/corner_logo.png';

const translations = {
    en: {
        dashboard: 'Dashboard',
        addVehicle: 'Register a Vehicle',
        myVehicles: 'My Vehicles',
        transfer: 'Transfer Ownership',
        status: 'Application Status',
        settings: 'Settings',
        logout: 'Logout',
    },
    si: {
        dashboard: 'උපකරණ පුවරුව',
        addVehicle: 'වාහනයක් ලියාපදිංචි කරන්න',
        myVehicles: 'මගේ වාහන',
        transfer: 'අයිතිය මාරු කිරීම',
        status: 'අයදුම්පත් තත්ත්වය',
        settings: 'සැකසුම්',
        logout: 'ඉවත් වන්න',
    },
    ta: {
        dashboard: 'டாஷ்போர்டு',
        addVehicle: 'வாகனத்தை பதிவு செய்க',
        myVehicles: 'எனது வாகனங்கள்',
        transfer: 'உரிமை மாற்றம்',
        status: 'விண்ணப்ப நிலை',
        settings: 'அமைப்புகள்',
        logout: 'வெளியேறு',
    },
};

const navItems = [
    { icon: Home, label: 'dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'addVehicle', path: '/register-vehicle' },
    { icon: Car, label: 'myVehicles', path: '/my-vehicles' },
    { icon: ArrowLeftRight, label: 'transfer', path: '/transfer-requests' },
    { icon: Inbox, label: 'status', path: '/status' },
    { icon: Settings, label: 'settings', path: '/settings' },
];

export const Sidebar = () => {
    const { isCollapsed, setCollapsed, language } = useStore();
    const lang = language ?? 'en';
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, scaleX: 1, scaleY: 1 });
    const [isAnimating, setIsAnimating] = useState(false);

    // iOS-style Liquid Glass Indicator with spring physics
    useEffect(() => {
        const updateIndicator = () => {
            if (navRef.current) {
                const activeLink = navRef.current.querySelector(`[data-path="${location.pathname}"]`);
                if (activeLink) {
                    const navRect = navRef.current.getBoundingClientRect();
                    const linkRect = activeLink.getBoundingClientRect();

                    // Trigger animation
                    setIsAnimating(true);

                    // iOS liquid glass "squish" effect - vertical compression first
                    setIndicatorStyle(prev => ({
                        ...prev,
                        scaleX: 0.92,
                        scaleY: 1.12,
                    }));

                    // After squish, move to new position
                    setTimeout(() => {
                        setIndicatorStyle({
                            top: linkRect.top - navRect.top,
                            height: linkRect.height,
                            scaleX: 1.06,
                            scaleY: 0.94,
                        });
                    }, 80);

                    // Settle with slight overshoot
                    setTimeout(() => {
                        setIndicatorStyle(prev => ({
                            ...prev,
                            scaleX: 0.98,
                            scaleY: 1.02,
                        }));
                    }, 180);

                    // Rest state
                    setTimeout(() => {
                        setIndicatorStyle(prev => ({
                            ...prev,
                            scaleX: 1,
                            scaleY: 1,
                        }));
                        setIsAnimating(false);
                    }, 280);
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(updateIndicator, 50);
        window.addEventListener('resize', updateIndicator);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateIndicator);
        };
    }, [location.pathname]);

    return (
        <div
            className={cn(
                'flex h-screen flex-col justify-between transition-all duration-500 sticky top-0 self-start overflow-hidden',
                'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950',
                'border-r border-white/5',
                isCollapsed ? 'w-20' : 'w-72'
            )}
        >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl -translate-x-1/2" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className={cn(
                    'flex items-center p-4 border-b border-white/5',
                    isCollapsed ? 'justify-center' : 'justify-between'
                )}>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="shrink-0 group" aria-label="Go to home">
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="DMT Home"
                                    className={cn(
                                        'rounded-xl border-2 border-white/10 transition-all duration-300 group-hover:border-red-500/50 group-hover:scale-105',
                                        isCollapsed ? 'h-10 w-10' : 'h-12 w-12'
                                    )}
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <h2 className="font-bold text-white text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    DMT Portal
                                </h2>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-red-500" />
                                    Dashboard
                                </span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={() => setCollapsed(!isCollapsed)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                </div>

                {/* Collapsed toggle */}
                {isCollapsed && (
                    <div className="flex justify-center py-3 border-b border-white/5">
                        <button
                            onClick={() => setCollapsed(!isCollapsed)}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {/* Navigation - Solid Style */}
                <nav ref={navRef} className="mt-6 px-3 space-y-1.5 relative">
                    {/* Standard Vertical Indicator */}
                    <div
                        className="absolute left-3 right-3 bg-red-600 rounded-xl z-0 transition-all duration-300 ease-in-out"
                        style={{
                            top: `${indicatorStyle.top}px`,
                            height: `${indicatorStyle.height}px`,
                            opacity: indicatorStyle.height > 0 ? 1 : 0,
                        }}
                    />

                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            data-path={path}
                            className={({ isActive }) =>
                                cn(
                                    'group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 z-10',
                                    isActive
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50',
                                    isCollapsed && 'justify-center px-2'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Icon wrapper */}
                                    <div className={cn(
                                        'relative flex items-center justify-center transition-all duration-300',
                                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                    )}>
                                        <Icon size={20} className="relative z-10" />
                                    </div>

                                    {/* Label */}
                                    {!isCollapsed && (
                                        <span className={cn(
                                            'text-sm font-medium transition-all duration-300',
                                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        )}>
                                            {translations[lang][label]}
                                        </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-white/10">
                                            {translations[lang][label]}
                                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900/95" />
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="relative z-10 p-3 border-t border-white/5">
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/login';
                    }}
                    className={cn(
                        'group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300',
                        'text-gray-400 hover:text-red-400',
                        isCollapsed && 'justify-center px-2'
                    )}
                >
                    {/* Hover glass effect for logout */}
                    <div className="absolute inset-0 rounded-2xl bg-red-500/0 group-hover:bg-red-500/10 backdrop-blur-0 group-hover:backdrop-blur-xl border border-transparent group-hover:border-red-500/20 transition-all duration-300" />

                    <div className="relative flex items-center justify-center text-current transition-all duration-300 group-hover:scale-110">
                        <LogOut size={20} />
                    </div>
                    {!isCollapsed && (
                        <span className="relative text-sm font-medium">{translations[lang].logout}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-white/10">
                            {translations[lang].logout}
                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900/95" />
                        </div>
                    )}
                </button>
            </div>

            {/* Add keyframes for shimmer animation */}
            <style>{`
        @keyframes sidebarShimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
      `}</style>
        </div>
    );
};
