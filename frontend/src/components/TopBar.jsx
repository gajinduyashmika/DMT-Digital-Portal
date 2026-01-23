import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Globe, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export const TopBar = () => {
    const { i18n } = useTranslation();
    const { isDarkMode, setDarkMode, setTopBarVisible } = useStore();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                // Scrolling down & past threshold
                setIsVisible(false);
                setTopBarVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
                setTopBarVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, setTopBarVisible]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const toggleTheme = () => {
        setDarkMode(!isDarkMode);
    };

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[60] bg-gray-900/90 backdrop-blur-xl py-2 border-b border-white/10 shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-end items-center gap-3">
                {/* Language Picker */}
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <Globe className="w-4 h-4 text-gray-400 mr-1" />
                    <button
                        className={`px-2.5 py-1 rounded-lg text-sm transition-all duration-300 ${i18n.language === 'si'
                                ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-400 font-medium shadow-inner'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        onClick={() => changeLanguage('si')}
                    >
                        සිංහල
                    </button>
                    <button
                        className={`px-2.5 py-1 rounded-lg text-sm transition-all duration-300 ${i18n.language === 'en'
                                ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-400 font-medium shadow-inner'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        onClick={() => changeLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`px-2.5 py-1 rounded-lg text-sm transition-all duration-300 ${i18n.language === 'ta'
                                ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-400 font-medium shadow-inner'
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        onClick={() => changeLanguage('ta')}
                    >
                        தமிழ்
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group overflow-hidden"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-opacity duration-300 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
                    <div className="relative">
                        {isDarkMode ? (
                            <Moon className="w-5 h-5 text-indigo-400 transition-transform duration-300 group-hover:rotate-12" />
                        ) : (
                            <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 group-hover:rotate-45" />
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};
