import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    UserX,
    UserCheck,
    RotateCcw,
    Send,
    Edit,
    MapPin,
    Calendar,
    Shield,
    Phone,
    Mail,
    Car,
    Clock,
    X,
    Download,
    FileText,
    AlertTriangle,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'info'
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [modalLoading, setModalLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axios.get(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setUsers(response.data.users || []);
            setError('');
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        setModalLoading(true);
        setActiveTab('overview');
        try {
            const response = await axios.get(`${API_URL}/admin/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Merge the detailed data
            setSelectedUser({
                ...response.data.user,
                vehicles: response.data.vehicles || [],
                applications: response.data.applications || [],
                vehicleCount: response.data.vehicles?.length || 0 // Ensure exact count from detail
            });
        } catch (err) {
            console.error('Error fetching user details:', err);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, statusFilter]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) {
                fetchUsers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleBlockUser = async (userId, currentStatus) => {
        try {
            setActionLoading(true);
            const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';

            await axios.put(
                `${API_URL}/admin/users/${userId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, status: newStatus } : u
            ));

            if (selectedUser?._id === userId) {
                setSelectedUser({ ...selectedUser, status: newStatus });
            }
        } catch (err) {
            console.error('Error updating user status:', err);
            setError('Failed to update user status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendNotification = async () => {
        if (!selectedUser || !notificationData.title || !notificationData.message) return;

        try {
            setActionLoading(true);
            await axios.post(
                `${API_URL}/admin/notifications`,
                {
                    userId: selectedUser.email,
                    title: notificationData.title,
                    message: notificationData.message,
                    type: notificationData.type,
                    audience: 'specific',
                    targetUsers: [selectedUser.email]
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowNotificationModal(false);
            setNotificationData({ title: '', message: '', type: 'info' });
        } catch (err) {
            console.error('Error sending notification:', err);
            setError('Failed to send notification');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'blocked': return 'bg-red-100 text-red-800';
            case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
            case 'incomplete': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <UserCheck className="h-4 w-4" />;
            case 'blocked': return <UserX className="h-4 w-4" />;
            case 'pending_verification': return <Clock className="h-4 w-4" />;
            default: return <AlertTriangle className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchUsers}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export Users</span>
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
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, NIC, email, or phone..."
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
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                            <option value="pending_verification">Pending Verification</option>
                        </select>
                        <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vehicles
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.profilePicture && user.profilePicture !== 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' ? (
                                                    <img
                                                        src={user.profilePicture}
                                                        alt=""
                                                        className="h-10 w-10 rounded-full object-cover mr-3 border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                                                    style={{ display: user.profilePicture && user.profilePicture !== 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' ? 'none' : 'flex' }}
                                                >
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {user.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.nic}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 mr-1" />
                                                {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                                                    {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status || 'active')}`}>
                                                {getStatusIcon(user.status || 'active')}
                                                <span className="ml-1 capitalize">{(user.status || 'active').replace('_', ' ')}</span>
                                            </span>
                                            {user.isVerified && (
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        <Shield className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Car className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm font-medium text-gray-900">{user.vehicleCount || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            {user.lastLogin && (
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Last: {new Date(user.lastLogin).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Profile"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowNotificationModal(true);
                                                    }}
                                                    className="text-purple-600 hover:text-purple-900 p-1 rounded"
                                                    title="Send Notification"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockUser(user._id, user.status || 'active')}
                                                    disabled={actionLoading}
                                                    className={`p-1 rounded disabled:opacity-50 ${user.status === 'blocked'
                                                        ? 'text-green-600 hover:text-green-900'
                                                        : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                                                >
                                                    {user.status === 'blocked' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* User Profile Modal */}
            {selectedUser && !showNotificationModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-0 border w-full max-w-5xl shadow-2xl rounded-xl bg-white flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                            <div className="flex items-center gap-4">
                                {selectedUser.profilePicture && selectedUser.profilePicture !== 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg' ? (
                                    <img src={selectedUser.profilePicture} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                ) : (
                                    <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {selectedUser.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail className="h-3 w-3" /> {selectedUser.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 px-6">
                            {['overview', 'vehicles', 'security'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <UserCheck className="h-4 w-4 text-blue-500" />
                                                Personal Information
                                            </h4>
                                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 mb-1">Full Name</p>
                                                    <p className="font-medium text-gray-900">{selectedUser.fullName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">National ID (NIC)</p>
                                                    <p className="font-medium text-gray-900">{selectedUser.nic}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Phone Number</p>
                                                    <p className="font-medium text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 mb-1">Address</p>
                                                    <p className="font-medium text-gray-900">{selectedUser.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Account Status</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                    <span className="text-sm text-gray-600">Current Status</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                                                        {getStatusIcon(selectedUser.status)}
                                                        <span className="ml-1 capitalize">{(selectedUser.status || 'active').replace('_', ' ')}</span>
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                    <span className="text-sm text-gray-600">Joined Date</span>
                                                    <span className="text-sm font-medium text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                    <span className="text-sm text-gray-600">Last Login</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'vehicles' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-900">Registered Vehicles ({selectedUser.vehicles?.length || 0})</h4>
                                    </div>
                                    {selectedUser.vehicles && selectedUser.vehicles.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedUser.vehicles.map((vehicle, index) => (
                                                <div key={vehicle._id || index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                                <Car className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{vehicle.makeModel || 'Unknown Vehicle'}</p>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wider">{vehicle.regNumber || 'Pending'}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                            {vehicle.status}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-gray-100 pt-3 mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                        <p>Year: <span className="font-medium text-gray-900">{vehicle.year}</span></p>
                                                        <p>Type: <span className="font-medium text-gray-900">{vehicle.vehicleType}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                            <Car className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500">No vehicles registered yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-purple-500" />
                                            Recent Login Activity
                                        </h4>
                                        <div className="overflow-hidden">
                                            {selectedUser.loginHistory && selectedUser.loginHistory.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {selectedUser.loginHistory.slice().reverse().map((log, idx) => (
                                                            <tr key={idx}>
                                                                <td className="px-4 py-3 text-sm text-gray-900">{log.device}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-500">{new Date(log.date).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 text-sm">No login history recorded.</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                        <h4 className="text-sm font-bold text-red-900 mb-2">Danger Zone</h4>
                                        <p className="text-sm text-red-700 mb-4">
                                            Blocking a user will prevent them from logging in and accessing their vehicles.
                                        </p>
                                        <button
                                            onClick={() => handleBlockUser(selectedUser._id, selectedUser.status || 'active')}
                                            disabled={actionLoading}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${selectedUser.status === 'blocked'
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                }`}
                                        >
                                            {selectedUser.status === 'blocked' ? 'Unblock User Account' : 'Block User Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Notification Modal */}
            {showNotificationModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Send Notification to {selectedUser.fullName}
                            </h3>
                            <button
                                onClick={() => setShowNotificationModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Type</label>
                                <select
                                    value={notificationData.type}
                                    onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="info">Information</option>
                                    <option value="success">Success</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={notificationData.title}
                                    onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter notification title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    value={notificationData.message}
                                    onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter notification message"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setShowNotificationModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendNotification}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Send Notification
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
