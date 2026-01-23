import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, Moon, Sun, LogOut, Settings, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

export const TopBarDashboard = () => {
    const { language, setLanguage, isDarkMode, setDarkMode } = useStore();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [profileName, setProfileName] = useState('User');
    const [avatarUrl, setAvatarUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownNotifications, setDropdownNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Load user profile (name + avatar) from backend using stored email
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
                const { fullName, profilePicture } = res.data;
                if (fullName) {
                    setProfileName(fullName);
                    localStorage.setItem('username', fullName);
                }
                if (profilePicture) {
                    setAvatarUrl(profilePicture);
                }
            } catch (error) {
                console.error('Failed to load user profile:', error);
                // fallback to any cached username
                const cachedName = localStorage.getItem('username');
                if (cachedName) setProfileName(cachedName);
            }
        };

        fetchProfile();
    }, []);

    // Load unread notification count
    useEffect(() => {
        const loadUnreadCount = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) return;

                const response = await axios.get(`http://localhost:5000/api/notifications/user/${userEmail}/unread-count`);
                setUnreadCount(response.data.count || 0);
            } catch (error) {
                console.error('Error loading unread count:', error);
            }
        };

        loadUnreadCount();
        // Refresh unread count every 30 seconds
        const interval = setInterval(loadUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Load dropdown notifications when panel opens
    const loadDropdownNotifications = async () => {
        try {
            setLoadingNotifications(true);
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) return;

            const response = await axios.get(`http://localhost:5000/api/notifications/user/${userEmail}`);
            // Get first 5 notifications
            setDropdownNotifications(response.data.slice(0, 5));
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notifDate.toLocaleDateString();
    };

    const handleNotificationsOpen = () => {
        if (!showNotifications) {
            loadDropdownNotifications();
        }
        setShowNotifications(!showNotifications);
        setShowLanguage(false);
        setShowProfile(false);
    };

    const currentLang = languages.find(l => l.code === language) || languages[0];

    return (
        <div className={`sticky top-0 z-40 flex h-18 items-center justify-between px-6 py-3 transition-colors duration-300 ${isDarkMode
            ? 'bg-gray-900 border-b border-gray-800'
            : 'bg-white border-b border-gray-200 shadow-sm'
            }`}>
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className={`relative group ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors group-focus-within:text-red-500" />
                    <input
                        type="text"
                        placeholder="Search vehicles, applications..."
                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500/50'
                            : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-red-500/30'
                            } focus:outline-none`}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!isDarkMode)}
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group ${isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
                        }`}
                >
                    <div className="relative">
                        {isDarkMode ? (
                            <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
                        ) : (
                            <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                        )}
                    </div>
                </button>

                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowLanguage(!showLanguage);
                            setShowNotifications(false);
                            setShowProfile(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <span className="text-base">{currentLang.flag}</span>
                        <span className="hidden sm:inline">{currentLang.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showLanguage ? 'rotate-180' : ''}`} />
                    </button>

                    {showLanguage && (
                        <div className={`absolute right-0 top-full mt-2 w-44 rounded-xl shadow-2xl overflow-hidden z-50 ${isDarkMode
                            ? 'bg-gray-800 border border-white/10'
                            : 'bg-white border border-gray-200'
                            }`}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setShowLanguage(false);
                                    }}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-all ${language === lang.code
                                        ? 'bg-red-500/10 text-red-500'
                                        : isDarkMode
                                            ? 'text-gray-300 hover:bg-white/5'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                    {language === lang.code && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={handleNotificationsOpen}
                        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-gray-900 animate-pulse" />
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            </>
                        )}
                    </button>

                    {showNotifications && (
                        <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50 ${isDarkMode
                            ? 'bg-gray-800 border border-white/10'
                            : 'bg-white border border-gray-200'
                            }`}>
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Notifications
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded-full">
                                        {unreadCount} new
                                    </span>
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {loadingNotifications ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                    </div>
                                ) : dropdownNotifications.length === 0 ? (
                                    <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    dropdownNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 border-b last:border-b-0 transition-colors cursor-pointer ${isDarkMode
                                                ? 'border-white/5 hover:bg-white/5'
                                                : 'border-gray-100 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                                )}
                                                <div className={!notification.isRead ? '' : 'ml-5'}>
                                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className={`mt-1.5 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {getTimeAgo(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className={`p-3 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate('/notifications');
                                    }}
                                    className="w-full text-center text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                                >
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className={`w-px h-8 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                            setShowLanguage(false);
                        }}
                        className={`flex items-center gap-3 rounded-xl p-2 pr-4 transition-all duration-300 ${isDarkMode
                            ? 'hover:bg-white/5'
                            : 'hover:bg-gray-100'
                            }`}
                    >
                        <div className="relative">
                            <img
                                src={avatarUrl}
                                alt="User"
                                className="h-9 w-9 rounded-xl object-cover ring-2 ring-red-500/20"
                                onError={(e) => {
                                    (e.currentTarget).src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
                                }}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {profileName}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                Vehicle Owner
                            </p>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showProfile ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                    </button>

                    {showProfile && (
                        <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50 ${isDarkMode
                            ? 'bg-gray-800 border border-white/10'
                            : 'bg-white border border-gray-200'
                            }`}>
                            {/* Profile Header */}
                            <div className={`p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={avatarUrl}
                                        alt="User"
                                        className="h-10 w-10 rounded-xl object-cover"
                                        onError={(e) => {
                                            (e.currentTarget).src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
                                        }}
                                    />
                                    <div>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {profileName}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            View Profile
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${isDarkMode
                                        ? 'text-gray-300 hover:bg-white/5'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => {
                                        setShowProfile(false);
                                        navigate('/settings');
                                    }}
                                >
                                    <Settings size={18} className="text-gray-400" />
                                    <span>Settings</span>
                                </button>
                                <button
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors text-red-500 ${isDarkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                                        }`}
                                    onClick={() => {
                                        const confirmed = window.confirm('Are you sure you want to logout?');
                                        if (!confirmed) return;
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('username');
                                        localStorage.removeItem('userEmail');
                                        localStorage.removeItem('registerVehicleFormData');
                                        localStorage.removeItem('userHasSeenLandingScreen');
                                        navigate('/login');
                                    }}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
