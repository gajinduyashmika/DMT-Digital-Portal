import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2, CheckCheck, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';
import axios from 'axios';
import { useToast } from '../../components/ToastContainer';

export const Notifications = () => {
    const { isDarkMode } = useStore();
    const { showToast } = useToast();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                showToast('error', 'User session expired');
                return;
            }

            const [notificationsRes, announcementsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/notifications/user/${userEmail}`),
                axios.get(`http://localhost:5000/api/announcements?target=all`) // Fetch active announcements
            ]);

            const personalNotifications = notificationsRes.data || [];

            // Transform announcements to match notification structure
            const systemAnnouncements = (announcementsRes.data || []).map(ann => ({
                _id: ann._id,
                title: ann.title,
                message: ann.content,
                type: ann.type === 'urgent' ? 'warning' : ann.type,
                createdAt: ann.createdAt,
                isRead: false, // Announcements are always "unread" unless tracked otherwise (simplification)
                isSystem: true // Flag to distinguish
            }));

            // Merge and sort by date
            const allItems = [...systemAnnouncements, ...personalNotifications].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(allItems);
        } catch (error) {
            console.error('Error loading notifications:', error);
            showToast('error', 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationBg = (type, isRead) => {
        if (isRead) {
            return isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50';
        }
        switch (type) {
            case 'success':
                return isDarkMode ? 'bg-green-500/10 border-l-4 border-green-500' : 'bg-green-50 border-l-4 border-green-500';
            case 'warning':
                return isDarkMode ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'info':
                return isDarkMode ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500';
            default:
                return isDarkMode ? 'bg-gray-500/10 border-l-4 border-gray-500' : 'bg-gray-50 border-l-4 border-gray-400';
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            showToast('error', 'Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) return;

            await axios.put(`http://localhost:5000/api/notifications/user/${userEmail}/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            showToast('success', 'All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            showToast('error', 'Failed to mark all as read');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            showToast('success', 'Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            showToast('error', 'Failed to delete notification');
        }
    };

    const filteredNotifications = notifications
        .filter(n => {
            if (filter === 'unread') return !n.isRead;
            if (filter === 'read') return n.isRead;
            return true;
        })
        .filter(n =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Group notifications by date
    const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
        const date = new Date(notification.createdAt).toISOString().split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(notification);
        return groups;
    }, {});

    const formatDateLabel = (date) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (date === today) return 'Today';
        if (date === yesterday) return 'Yesterday';
        return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return notifDate.toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
                            }`}>
                            <Bell className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Notifications
                            </h1>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Filters & Search */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/50 border border-white/5' : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors ${isDarkMode
                            ? 'bg-gray-700 border border-white/10 text-white placeholder-gray-400 focus:border-white/20'
                            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                            } outline-none`}
                    />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                ? isDarkMode
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-600 text-white'
                                : isDarkMode
                                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'
                        }`}>
                        <Bell className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            No notifications
                        </p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {filter !== 'all' ? 'Try changing your filter' : 'You\'re all caught up!'}
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedNotifications).map(([date, notifs]) => (
                        <div key={date}>
                            <div className="flex items-center gap-3 mb-3">
                                <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {formatDateLabel(date)}
                                </span>
                                <div className={`flex-1 h-px ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                            </div>

                            <div className="space-y-2">
                                {notifs.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${getNotificationBg(notification.type, notification.isRead)
                                            } ${!notification.isRead ? 'hover:shadow-lg' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-0.5 p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'
                                                }`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                            } ${!notification.isRead ? 'font-bold' : ''}`}>
                                                            {notification.title}
                                                        </h3>
                                                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            {notification.message}
                                                        </p>
                                                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                                            }`}>
                                                            {getTimeAgo(notification.createdAt)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification._id);
                                                                }}
                                                                className={`p-2 rounded-lg transition-colors ${isDarkMode
                                                                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                                                                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                                                    }`}
                                                                title="Mark as read"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notification._id);
                                                            }}
                                                            className={`p-2 rounded-lg transition-colors ${isDarkMode
                                                                ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                                                                : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                                                                }`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {!notification.isRead && (
                                                <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>);
};
