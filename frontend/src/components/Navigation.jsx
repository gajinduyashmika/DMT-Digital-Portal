import { Menu, X, LogOut, AlertTriangle, Settings, Sun, Moon, Globe, Check } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from './ToastContainer';
import { useStore } from '../store/useStore';
import logo from '../assets/corner_logo.png';

export const Navigation = () => {
    const { t, i18n } = useTranslation();
    const { showToast } = useToast();
    const { isDarkMode, setDarkMode, language, setLanguage } = useStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, scaleX: 1, scaleY: 1 });
    const [isAnimating, setIsAnimating] = useState(false);
    const navRef = useRef(null);
    const settingsPanelRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const mobileSettingsButtonRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'home' },
        { path: '/register', label: 'register_vehicle' },
        { path: '/check-details', label: 'check_details' },
        { path: '/about', label: 'about_us' },
        { path: '/support', label: 'contact' },
    ];

    const languages = [
        { code: 'en', label: 'English', native: 'EN' },
        { code: 'si', label: 'සිංහල', native: 'සිං' },
        { code: 'ta', label: 'தமிழ்', native: 'த' },
    ];

    useEffect(() => {
        const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close settings panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;

            // Don't close if clicking inside the settings panel
            if (target.closest('[data-settings-panel]')) return;
            // Don't close if clicking on settings button
            if (target.closest('[data-settings-button]')) return;

            if (showSettingsPanel) {
                setShowSettingsPanel(false);
            }
        };

        // Use click instead of mousedown for better button handling
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showSettingsPanel]);

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

                    // iOS liquid glass "squish" effect - first compress, then expand
                    setIndicatorStyle(prev => ({
                        ...prev,
                        scaleX: 1.15,
                        scaleY: 0.85,
                    }));

                    // After squish, move to new position and restore shape
                    setTimeout(() => {
                        setIndicatorStyle({
                            left: linkRect.left - navRect.left,
                            width: linkRect.width,
                            scaleX: 0.95,
                            scaleY: 1.08,
                        });
                    }, 80);

                    // Final settle with slight overshoot
                    setTimeout(() => {
                        setIndicatorStyle(prev => ({
                            ...prev,
                            scaleX: 1.02,
                            scaleY: 0.98,
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
                } else {
                    setIndicatorStyle({ left: 0, width: 0, scaleX: 1, scaleY: 1 });
                }
            }
        };

        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [location.pathname]);

    const openLogoutModal = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        setIsAuthed(false);
        setShowLogoutModal(false);
        showToast('success', t('logged_out_successfully'));
        navigate('/');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const isActive = (path) => location.pathname === path;

    // Fixed handlers - direct function calls without useCallback
    const handleLanguageChange = (e, lng) => {
        e.preventDefault();
        e.stopPropagation();
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    const handleThemeChange = (e, dark) => {
        e.preventDefault();
        e.stopPropagation();
        setDarkMode(dark);
    };

    const toggleSettingsPanel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowSettingsPanel(prev => !prev);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800'
                : 'bg-white/95 dark:bg-gray-900/95 border-b border-transparent'
                }`}>
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center h-[72px] py-3">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="DMT Logo"
                                    className="relative w-11 h-11 object-contain rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                    DMT Digital Portal
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                                    Vehicle Registration
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links - Clean Style */}
                        <div className="hidden lg:flex items-center gap-1">

                            {navItems.map((item) => {
                                // Special handling for Register Vehicle
                                if (item.label === 'register_vehicle') {
                                    return (
                                        <button
                                            key={item.label} // Use label as key since path is dynamic/virtual
                                            data-path={isAuthed ? '/register-vehicle' : '/login'} // For indicator matching relative to current path?
                                            // The indicator matching uses data-path vs location.pathname. 
                                            // If on landing, path is /, click reg -> goes to /register-vehicle (dashboard) or /login
                                            // We'll just set it to trigger navigation manually
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (isAuthed) {
                                                    navigate('/register-vehicle');
                                                } else {
                                                    showToast('error', 'Please log in to register a vehicle');
                                                    navigate('/login');
                                                }
                                            }}
                                            className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl ${isAuthed
                                                ? 'text-gray-900 hover:text-red-600 bg-gray-50 hover:bg-gray-100'
                                                : 'text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-100'
                                                }`}
                                        >
                                            {t(item.label)}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl ${isActive(item.path)
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {t(item.label)}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Auth Buttons + Settings */}
                        <div className="hidden lg:flex items-center gap-3">
                            {isAuthed ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                                    >
                                        {t('go_to_dashboard')}
                                    </Link>
                                    <button
                                        onClick={openLogoutModal}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        {t('logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            )}

                            {/* Settings Button */}
                            <div className="relative">
                                <button
                                    ref={settingsButtonRef}
                                    data-settings-button
                                    onClick={toggleSettingsPanel}
                                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${showSettingsPanel
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Settings className={`w-5 h-5 transition-transform duration-500 ${showSettingsPanel ? 'rotate-90' : ''}`} />
                                </button>

                                {/* Desktop Settings Panel */}
                                {showSettingsPanel && (
                                    <div
                                        ref={settingsPanelRef}
                                        data-settings-panel
                                        className="absolute top-full right-0 mt-3 w-72 z-[60]"
                                        style={{
                                            animation: 'slideIn 0.2s ease-out forwards',
                                        }}
                                    >
                                        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                                            {/* Panel Header */}
                                            <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                                                            <Settings className="w-5 h-5 text-red-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-semibold">Settings</h3>
                                                            <p className="text-xs text-gray-500">Customize your experience</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowSettingsPanel(false)}
                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4 space-y-4">
                                                {/* Theme Switcher */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                                        <Sun className="w-3.5 h-3.5" />
                                                        Theme
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleThemeChange(e, false)}
                                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${!isDarkMode
                                                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400'
                                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                                }`}
                                                        >
                                                            <Sun className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Light</span>
                                                            {!isDarkMode && <Check className="w-4 h-4 ml-auto" />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleThemeChange(e, true)}
                                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${isDarkMode
                                                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400'
                                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                                }`}
                                                        >
                                                            <Moon className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Dark</span>
                                                            {isDarkMode && <Check className="w-4 h-4 ml-auto" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Language Switcher */}
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                                        <Globe className="w-3.5 h-3.5" />
                                                        Language
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {languages.map((lang) => (
                                                            <button
                                                                type="button"
                                                                key={lang.code}
                                                                onClick={(e) => handleLanguageChange(e, lang.code)}
                                                                className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all duration-300 ${i18n.language === lang.code || language === lang.code
                                                                    ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
                                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                                    }`}
                                                            >
                                                                <span className="text-lg font-bold">{lang.native}</span>
                                                                <span className="text-[10px] opacity-70">{lang.label}</span>
                                                                {(i18n.language === lang.code || language === lang.code) && (
                                                                    <Check className="w-3 h-3 absolute top-1.5 right-1.5" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Panel Footer */}
                                            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                                                <p className="text-[10px] text-gray-500 text-center">
                                                    Settings are saved automatically
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-2">
                            {/* Mobile Settings Button */}
                            <button
                                ref={mobileSettingsButtonRef}
                                data-settings-button
                                onClick={toggleSettingsPanel}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${showSettingsPanel
                                    ? 'bg-white/20 border-white/30 text-white'
                                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                <Settings className={`w-5 h-5 transition-transform duration-500 ${showSettingsPanel ? 'rotate-90' : ''}`} />
                            </button>

                            <button
                                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="glass-dark border-t border-white/10 px-6 py-6 space-y-2">
                        <Link
                            to="/"
                            className={`block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-all ${isActive('/') ? 'bg-white/10' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('home')}
                        </Link>
                        <Link
                            to={isAuthed ? "/register-vehicle" : "/login"}
                            onClick={(e) => {
                                setIsMobileMenuOpen(false);
                                if (!isAuthed) {
                                    e.preventDefault();
                                    showToast('error', 'Please log in to register a vehicle');
                                    navigate('/login');
                                }
                            }}
                            className={`block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-all ${isActive('/register-vehicle') ? 'bg-white/10' : ''}`}
                        >
                            {t('register_vehicle')}
                        </Link>
                        <Link
                            to="/check-details"
                            className={`block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-all ${isActive('/check-details') ? 'bg-white/10' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('check_details')}
                        </Link>
                        <Link
                            to="/about"
                            className={`block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-all ${isActive('/about') ? 'bg-white/10' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('about_us')}
                        </Link>
                        <Link
                            to="/support"
                            className={`block px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-all ${isActive('/support') ? 'bg-white/10' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('contact')}
                        </Link>

                        <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                            {isAuthed ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-center py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('go_to_dashboard')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            openLogoutModal();
                                        }}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-lg shadow-red-500/30"
                                    >
                                        {t('logout')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full text-center py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium shadow-lg shadow-red-500/30"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Settings Panel (shown below nav) */}
                {showSettingsPanel && (
                    <div
                        ref={settingsPanelRef}
                        data-settings-panel
                        className="lg:hidden absolute top-full right-4 mt-2 w-72 z-[60]"
                        style={{
                            animation: 'slideIn 0.2s ease-out forwards',
                        }}
                    >
                        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                            {/* Panel Header */}
                            <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                                            <Settings className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Settings</h3>
                                            <p className="text-xs text-gray-500">Customize your experience</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowSettingsPanel(false)}
                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Theme Switcher */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                        <Sun className="w-3.5 h-3.5" />
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => handleThemeChange(e, false)}
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${!isDarkMode
                                                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <Sun className="w-4 h-4" />
                                            <span className="text-sm font-medium">Light</span>
                                            {!isDarkMode && <Check className="w-4 h-4 ml-auto" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleThemeChange(e, true)}
                                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${isDarkMode
                                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <Moon className="w-4 h-4" />
                                            <span className="text-sm font-medium">Dark</span>
                                            {isDarkMode && <Check className="w-4 h-4 ml-auto" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Language Switcher */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                        <Globe className="w-3.5 h-3.5" />
                                        Language
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {languages.map((lang) => (
                                            <button
                                                type="button"
                                                key={lang.code}
                                                onClick={(e) => handleLanguageChange(e, lang.code)}
                                                className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all duration-300 ${i18n.language === lang.code || language === lang.code
                                                    ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 text-red-400'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <span className="text-lg font-bold">{lang.native}</span>
                                                <span className="text-[10px] opacity-70">{lang.label}</span>
                                                {(i18n.language === lang.code || language === lang.code) && (
                                                    <Check className="w-3 h-3 absolute top-1.5 right-1.5" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Panel Footer */}
                            <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                                <p className="text-[10px] text-gray-500 text-center">
                                    Settings are saved automatically
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] px-4">
                    {/* Animated background orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />
                    </div>

                    <div className="relative max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
                        {/* Glass card */}
                        <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                            {/* Top gradient accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

                            {/* Glass reflections */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            {/* Close button */}
                            <button
                                onClick={cancelLogout}
                                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
                            >
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="p-8 pt-10">
                                {/* Icon with animated ring */}
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    {/* Pulsing outer rings */}
                                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="absolute inset-2 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

                                    {/* Main icon container */}
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/40">
                                            <LogOut className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Warning badge */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                                        <span className="text-xs font-medium text-yellow-500">Confirm Action</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    {t('confirm_logout')}
                                </h2>

                                {/* Description */}
                                <p className="text-gray-400 text-center mb-8 leading-relaxed">
                                    {t('logout_message')}
                                </p>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={cancelLogout}
                                        className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={confirmLogout}
                                        className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t('logout')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Keyframes for animations */}
            <style>{`
        @keyframes liquidShimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </>
    );
};
