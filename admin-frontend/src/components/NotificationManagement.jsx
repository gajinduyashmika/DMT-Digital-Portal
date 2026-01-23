import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Send,
    Calendar,
    Users,
    Mail,
    MessageSquare,
    Smartphone,
    CheckCircle,
    Clock,
    AlertTriangle,
    Edit,
    Trash2,
    X,
    Paperclip,
    Target,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function NotificationManagement() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [audienceFilter, setAudienceFilter] = useState('all');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        audience: 'global',
        targetUsers: [],
        channels: ['web'],
        scheduledFor: '',
        expiryDate: '',
        priority: 'medium'
    });

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (typeFilter !== 'all') params.append('type', typeFilter);
            if (audienceFilter !== 'all') params.append('audience', audienceFilter);

            const response = await axios.get(`${API_URL}/admin/notifications?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotifications(response.data.notifications || []);
            setError('');
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token, statusFilter, typeFilter, audienceFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'sent': return <CheckCircle className="h-4 w-4" />;
            case 'scheduled': return <Clock className="h-4 w-4" />;
            case 'draft': return <Edit className="h-4 w-4" />;
            default: return <AlertTriangle className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'info': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': case 'critical': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleSubmit = async (e, sendNow = false) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const payload = {
                ...formData,
                scheduledFor: sendNow ? null : formData.scheduledFor || null,
                expiryDate: formData.expiryDate || null
            };

            const response = await axios.post(`${API_URL}/admin/notifications`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (sendNow && response.data.notification?.status !== 'sent') {
                // Send immediately if not already sent
                await axios.post(`${API_URL}/admin/notifications/${response.data.notification._id}/send`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setSuccessMessage(sendNow ? 'Notification sent successfully' : 'Notification saved as draft');
            setTimeout(() => setSuccessMessage(''), 3000);

            setShowCreateForm(false);
            setFormData({
                title: '',
                message: '',
                type: 'info',
                audience: 'global',
                targetUsers: [],
                channels: ['web'],
                scheduledFor: '',
                expiryDate: '',
                priority: 'medium'
            });

            fetchNotifications();
        } catch (err) {
            console.error('Error creating notification:', err);
            setError('Failed to create notification');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendNotification = async (id) => {
        try {
            await axios.post(`${API_URL}/admin/notifications/${id}/send`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Notification sent successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchNotifications();
        } catch (err) {
            console.error('Error sending notification:', err);
            setError('Failed to send notification');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteNotification = async (id) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;

        try {
            await axios.delete(`${API_URL}/admin/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Notification deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting notification:', err);
            setError('Failed to delete notification');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchNotifications}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Notification</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="draft">Draft</option>
                            <option value="expired">Expired</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="info">Information</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                        <select
                            value={audienceFilter}
                            onChange={(e) => setAudienceFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Audiences</option>
                            <option value="global">Global</option>
                            <option value="staff">Staff Only</option>
                            <option value="selected">Selected Users</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        No notifications found
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div key={notification._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                                            {getStatusIcon(notification.status)}
                                            <span className="ml-1 capitalize">{notification.status}</span>
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                            {notification.type}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                            {notification.priority} priority
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{notification.message}</p>

                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Target className="h-4 w-4" />
                                            <span className="capitalize">{notification.audience}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {notification.sentAt
                                                    ? new Date(notification.sentAt).toLocaleDateString()
                                                    : notification.scheduledFor
                                                        ? `Scheduled: ${new Date(notification.scheduledFor).toLocaleDateString()}`
                                                        : 'Draft'
                                                }
                                            </span>
                                        </div>
                                        {notification.status === 'sent' && (
                                            <>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{notification.viewCount} views</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>{notification.acknowledgements} acknowledged</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="text-xs text-gray-500">Channels:</span>
                                        {notification.channels.map((channel) => (
                                            <span key={channel} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {channel === 'web' && <MessageSquare className="h-3 w-3 mr-1" />}
                                                {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                                                {channel === 'sms' && <Smartphone className="h-3 w-3 mr-1" />}
                                                {channel}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleDeleteNotification(notification._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    {(notification.status === 'draft' || notification.status === 'scheduled') && (
                                        <button
                                            onClick={() => handleSendNotification(notification._id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                        >
                                            <Send className="h-3 w-3" />
                                            <span>Send</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Notification Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Create New Notification</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter notification title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter notification message"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="info">Information</option>
                                                <option value="success">Success</option>
                                                <option value="warning">Warning</option>
                                                <option value="error">Error</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                        <select
                                            value={formData.audience}
                                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="global">All Users</option>
                                            <option value="users">Users Only</option>
                                            <option value="staff">Staff Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Channels</label>
                                        <div className="space-y-2">
                                            {['web', 'email', 'sms'].map((channel) => (
                                                <label key={channel} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.channels.includes(channel)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, channels: [...formData.channels, channel] });
                                                            } else {
                                                                setFormData({ ...formData, channels: formData.channels.filter(c => c !== channel) });
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700 capitalize flex items-center">
                                                        {channel === 'web' && <MessageSquare className="h-4 w-4 mr-1" />}
                                                        {channel === 'email' && <Mail className="h-4 w-4 mr-1" />}
                                                        {channel === 'sms' && <Smartphone className="h-4 w-4 mr-1" />}
                                                        {channel}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule For (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.scheduledFor}
                                            onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.expiryDate}
                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : 'Save as Draft'}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
