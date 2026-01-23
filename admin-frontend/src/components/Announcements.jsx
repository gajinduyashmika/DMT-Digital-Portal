import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Send,
    Calendar,
    Users,
    Eye,
    CheckCircle,
    Clock,
    AlertTriangle,
    Edit,
    Trash2,
    X,
    RefreshCw,
    Pin
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Announcements() {
    const { token } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetAudience: 'all',
        expiresAt: '',
        priority: 'medium',
        isPinned: false
    });

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/announcements`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAnnouncements(response.data.announcements || []);
            setError('');
        } catch (err) {
            console.error('Error fetching announcements:', err);
            setError('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAnnouncements();
        }
    }, [token]);

    const getStatusColor = (isActive, expiresAt) => {
        if (!isActive) return 'bg-gray-100 text-gray-800';
        if (expiresAt && new Date(expiresAt) < new Date()) return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (isActive, expiresAt) => {
        if (!isActive) return 'Inactive';
        if (expiresAt && new Date(expiresAt) < new Date()) return 'Expired';
        return 'Active';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesSearch = announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            announcement.content?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleSubmit = async (e, sendNow = true) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            await axios.post(
                `${API_URL}/admin/announcements`,
                {
                    ...formData,
                    isActive: sendNow
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowCreateForm(false);
            setFormData({
                title: '',
                content: '',
                targetAudience: 'all',
                expiresAt: '',
                priority: 'medium',
                isPinned: false
            });
            fetchAnnouncements();
        } catch (err) {
            console.error('Error creating announcement:', err);
            setError(err.response?.data?.message || 'Failed to create announcement');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            setActionLoading(true);
            await axios.delete(
                `${API_URL}/admin/announcements/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            console.error('Error deleting announcement:', err);
            setError('Failed to delete announcement');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            setActionLoading(true);
            await axios.put(
                `${API_URL}/admin/announcements/${id}`,
                { isActive: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAnnouncements(prev => prev.map(a =>
                a._id === id ? { ...a, isActive: !currentStatus } : a
            ));
        } catch (err) {
            console.error('Error updating announcement:', err);
            setError('Failed to update announcement');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchAnnouncements}
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
                        <span>Create Announcement</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : filteredAnnouncements.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No announcements found
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => (
                        <div key={announcement._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.isActive, announcement.expiresAt)}`}>
                                            {announcement.isActive ? <CheckCircle className="h-4 w-4 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                                            <span className="capitalize">{getStatusText(announcement.isActive, announcement.expiresAt)}</span>
                                        </span>
                                        {announcement.priority && (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                                                {announcement.priority} priority
                                            </span>
                                        )}
                                        {announcement.isPinned && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <Pin className="h-3 w-3 mr-1 transform rotate-45" />
                                                Pinned
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>

                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Users className="h-4 w-4" />
                                            <span className="capitalize">{announcement.targetAudience}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {announcement.createdBy && (
                                            <div className="flex items-center space-x-1">
                                                <span>By: {announcement.createdBy.name}</span>
                                            </div>
                                        )}
                                        {announcement.expiresAt && (
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleToggleActive(announcement._id, announcement.isActive)}
                                        disabled={actionLoading}
                                        className={`p-2 rounded disabled:opacity-50 ${announcement.isActive ? 'text-gray-400 hover:text-gray-600' : 'text-green-400 hover:text-green-600'}`}
                                        title={announcement.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {announcement.isActive ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement._id)}
                                        disabled={actionLoading}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Announcement Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Create New Announcement</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter announcement title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter announcement content"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                        <select
                                            value={formData.targetAudience}
                                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="all">All Users</option>
                                            <option value="active_users">Active Users</option>
                                            <option value="pending_users">Pending Users</option>
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
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                                        <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={formData.isPinned}
                                                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                                            />
                                            <span className="text-sm text-gray-700 flex items-center gap-2">
                                                <Pin className="h-4 w-4 transform rotate-45" />
                                                Pin to Dashboard Top
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.expiresAt}
                                            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
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
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, false)}
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
