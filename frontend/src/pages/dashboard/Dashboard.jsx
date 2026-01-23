import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import {
    Car,
    Clock,
    RefreshCw,
    CheckCircle,
    PlusCircle,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const translations = {
    en: {
        welcome: 'Welcome to DMT Dashboard',
        stats: {
            total: 'Total Vehicles',
            pending: 'Pending Applications',
            transfer: 'Transfer Requests',
            approved: 'Approved Applications',
        },
        quickActions: 'Quick Actions',
        actions: {
            register: 'Register New Vehicle',
            transfer: 'Transfer Ownership',
            status: 'Check Status',
        },
        recentActivity: 'Recent Activity',
    },
    si: {
        welcome: 'DMT උපකරණ පුවරුවට සාදරයෙන් පිළිගනිමු',
        stats: {
            total: 'මුළු වාහන',
            pending: 'අපේක්ෂිත අයදුම්පත්',
            transfer: 'මාරු කිරීමේ ඉල්ලීම්',
            approved: 'අනුමත කළ අයදුම්පත්',
        },
        quickActions: 'ක්ෂණික ක්‍රියාමාර්ග',
        actions: {
            register: 'නව වාහනයක් ලියාපදිංචි කරන්න',
            transfer: 'අයිතිය මාරු කරන්න',
            status: 'තත්ත්වය පරීක්ෂා කරන්න',
        },
        recentActivity: 'මෑත ක්‍රියාකාරකම්',
    },
    ta: {
        welcome: 'DMT டாஷ்போர்டுக்கு வரவேற்கிறோம்',
        stats: {
            total: 'மொத்த வாகனங்கள்',
            pending: 'நிலுவையில் உள்ள விண்ணப்பங்கள்',
            transfer: 'மாற்ற கோரிக்கைகள்',
            approved: 'அங்கீகரிக்கப்பட்ட விண்ணப்பங்கள்',
        },
        quickActions: 'விரைவு செயல்கள்',
        actions: {
            register: 'புதிய வாகனத்தை பதிவு செய்க',
            transfer: 'உரிமையை மாற்றவும்',
            status: 'நிலையை சரிபார்க்கவும்',
        },
        recentActivity: 'சமீபத்திய செயல்பாடு',
    },
};

const statColors = [
    { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600' },
    { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50', text: 'text-amber-600' },
    { bg: 'from-purple-500 to-pink-500', light: 'bg-purple-50', text: 'text-purple-600' },
    { bg: 'from-green-500 to-emerald-500', light: 'bg-green-50', text: 'text-green-600' },
];

export const Dashboard = () => {
    const { language, isDarkMode } = useStore();
    const [stats, setStats] = useState([
        { icon: Car, label: 'total', value: '0' },
        { icon: Clock, label: 'pending', value: '0' },
        { icon: RefreshCw, label: 'transfer', value: '0' },
        { icon: CheckCircle, label: 'approved', value: '0' },
    ]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileName, setProfileName] = useState('User');
    const [pinnedAnnouncement, setPinnedAnnouncement] = useState(null);

    useEffect(() => {
        const cachedName = localStorage.getItem('username');
        if (cachedName) setProfileName(cachedName);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    throw new Error('No user email found');
                }

                // Fetch user's vehicles
                const vehiclesResponse = await axios.get(`http://localhost:5000/api/vehicles/owner/${userEmail}`);
                const vehicles = Array.isArray(vehiclesResponse.data) ? vehiclesResponse.data : [];

                // Fetch user's applications
                const applicationsResponse = await axios.get(`http://localhost:5000/api/applications/user/${userEmail}`);
                const applications = Array.isArray(applicationsResponse.data) ? applicationsResponse.data : [];

                // Calculate stats from vehicles
                const totalVehicles = vehicles.length;
                const pendingCount = vehicles.filter((v) => v.status === 'Pending').length;
                const transferCount = vehicles.filter((v) => v.transferStatus === 'Pending Transfer').length;
                const approvedCount = vehicles.filter((v) => v.status === 'Approved').length;

                setStats([
                    { icon: Car, label: 'total', value: totalVehicles.toString() },
                    { icon: Clock, label: 'pending', value: pendingCount.toString() },
                    { icon: RefreshCw, label: 'transfer', value: transferCount.toString() },
                    { icon: CheckCircle, label: 'approved', value: approvedCount.toString() },
                ]);

                // Combine and sort activities from both vehicles and applications
                const combinedActivities = [
                    ...vehicles.map((vehicle) => ({
                        id: vehicle._id,
                        vehicleNo: vehicle.regNumber || 'Pending Registration',
                        action: `${vehicle.makeModel} - ${vehicle.status}`,
                        time: new Date(vehicle.createdAt).toLocaleString(),
                        status: vehicle.status,
                        type: 'vehicle',
                        isVip: false,
                    })),
                    ...applications.map((app) => ({
                        id: app._id,
                        vehicleNo: app.vipNumber || `${app.makeOfVehicle} ${app.modelOfVehicle}`,
                        action: `Application - ${app.status}`,
                        time: new Date(app.createdAt).toLocaleString(),
                        status: app.status,
                        type: 'application',
                        isVip: !!(app.vipNumber || app.vipRequested),
                    })),
                ];

                // Sort by most recent first and take top 5
                const sortedActivities = combinedActivities
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .slice(0, 5);

                setRecentActivities(sortedActivities);

                // Fetch Pinned Announcements
                try {
                    const announcementsRes = await axios.get('http://localhost:5000/api/announcements');
                    const pinned = announcementsRes.data.find(a => a.isPinned);
                    setPinnedAnnouncement(pinned);
                } catch (e) {
                    console.error("Failed to fetch announcements", e);
                }

            } catch (err) {
                // Show 0s on error instead of '!'
                setStats([
                    { icon: Car, label: 'total', value: '0' },
                    { icon: Clock, label: 'pending', value: '0' },
                    { icon: RefreshCw, label: 'transfer', value: '0' },
                    { icon: CheckCircle, label: 'approved', value: '0' },
                ]);
                setRecentActivities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const refreshDashboard = async () => {
        setLoading(true);
        await fetchDashboardData();
    };

    const quickActions = [
        { icon: PlusCircle, label: 'register', path: '/register-vehicle', gradient: 'from-red-500 to-red-600' },
        { icon: RefreshCw, label: 'transfer', path: '/transfer', gradient: 'from-purple-500 to-pink-500' },
        { icon: AlertCircle, label: 'status', path: '/status', gradient: 'from-blue-500 to-cyan-500' },
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 p-1">
            {/* Pinned Announcement Banner */}
            {pinnedAnnouncement && (
                <Link to="/notifications" className="block">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg shadow-blue-500/20 flex items-center justify-between text-white hover:shadow-blue-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-white/20 p-1.5 rounded-lg flex-shrink-0 animate-pulse">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1">
                                    Pinned Announcement
                                </span>
                                <span className="text-sm font-medium truncate group-hover:underline decoration-white/50 underline-offset-2">
                                    {pinnedAnnouncement.title}
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            )}

            {/* Welcome Section */}
            <div className={`relative overflow-hidden rounded-2xl p-8 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-white to-gray-50'
                } border ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-red-500" />
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                DMT Digital Portal
                            </span>
                        </div>
                        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Welcome back, {profileName}!
                        </h1>
                        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Here's what's happening with your vehicles today.
                        </p>
                    </div>
                    <Link
                        to="/register-vehicle"
                        className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Register Vehicle
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ icon: Icon, label, value }, index) => (
                    <div
                        key={label}
                        className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isDarkMode
                            ? 'bg-gray-800/50 border border-white/5 hover:border-white/10'
                            : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg'
                            }`}
                    >
                        {/* Gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${statColors[index].bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="relative flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {translations[language].stats[label]}
                                </p>
                                <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {loading ? '...' : value}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <TrendingUp className={`w-4 h-4 ${statColors[index].text}`} />
                                    <span className={`text-xs font-medium ${statColors[index].text}`}>Active</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/5' : statColors[index].light}`}>
                                <Icon className={`h-6 w-6 ${statColors[index].text}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className={`rounded-2xl p-6 ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100'
                }`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {translations[language].quickActions}
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {quickActions.map(({ icon: Icon, label, path, gradient }) => (
                        <Link
                            key={label}
                            to={path}
                            className={`group relative flex items-center gap-4 rounded-xl p-5 transition-all duration-300 overflow-hidden ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 border border-white/5'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                                }`}
                        >
                            {/* Hover gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            <div className={`relative p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="relative flex-1">
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {translations[language].actions[label]}
                                </span>
                            </div>
                            <ArrowRight className={`relative w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl p-6 ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100'
                }`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {translations[language].recentActivity}
                    </h2>
                    <Link
                        to="/my-vehicles"
                        className={`text-sm font-medium flex items-center gap-1 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                            } transition-colors`}
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivities.length === 0 ? (
                            <div className={`text-center py-12 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                                }`}>
                                <Car className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No recent activity found.</p>
                                <Link
                                    to="/register-vehicle"
                                    className="inline-flex items-center gap-2 mt-4 text-red-500 hover:text-red-600 font-medium"
                                >
                                    Register your first vehicle
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={`flex items-center justify-between rounded-xl p-4 transition-all duration-300 ${isDarkMode
                                        ? 'bg-white/5 hover:bg-white/10 border border-white/5'
                                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                                            <Car className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        </div>
                                        <div>
                                            <p className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {activity.vehicleNo}
                                                {activity.isVip && (
                                                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">Special</span>
                                                )}
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {activity.action}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                            {activity.status}
                                        </span>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
