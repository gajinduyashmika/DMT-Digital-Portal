import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Calendar,
    User,
    MapPin,
    Activity,
    Shield,
    FileText,
    Settings,
    UserCheck,
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function AuditLogs() {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('admin');

    const [selectedLog, setSelectedLog] = useState(null);

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) fetchAuditLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, actionFilter, activeTab, token]);

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            const params = {
                page: 1, // Reset to page 1 on filter change
                limit: 50,
                actorType: activeTab === 'admin' ? 'Admin' : 'User'
            };

            if (searchTerm) params.search = searchTerm;
            if (actionFilter !== 'all') params.action = actionFilter;

            const response = await axios.get(`${API_URL}/admin/announcements/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setLogs(response.data.logs || []);
            setError('');
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            setError('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    // removed client side effective effect

    // Helper to extract actor identifier
    const getActorIdentifier = (log) => {
        if (log.actorName) return log.actorName;
        if (log.adminId?.name) return log.adminId.name;
        if (log.userId?.fullName) return log.userId.fullName;
        if (log.actorEmail) return log.actorEmail;
        return 'Unknown';
    };

    const getActorSubtext = (log) => {
        if (log.adminId?.role) return log.adminId.role; // For admins
        if (log.actorEmail) return log.actorEmail;      // For users/public
        if (log.role) return log.role;
        return activeTab === 'admin' ? 'Administrator' : 'User';
    };

    // Helper functions for UI
    const getSeverityColor = (action) => {
        if (!action) return 'bg-gray-100 text-gray-800';
        if (action.includes('BLOCK') || action.includes('REJECT') || action.includes('DELETE')) {
            return 'bg-red-100 text-red-800';
        }
        if (action.includes('APPROVE') || action.includes('CREATE')) {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-yellow-100 text-yellow-800';
    };

    const getActionIcon = (action) => {
        if (!action) return <Activity className="h-4 w-4 text-gray-600" />;
        if (action.includes('LOGIN') || action.includes('LOGOUT')) {
            return <UserCheck className="h-4 w-4 text-blue-600" />;
        }
        if (action.includes('APPROVE')) {
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        }
        if (action.includes('REJECT') || action.includes('BLOCK')) {
            return <AlertTriangle className="h-4 w-4 text-red-600" />;
        }
        if (action.includes('TICKET')) {
            return <FileText className="h-4 w-4 text-purple-600" />;
        }
        if (action.includes('ANNOUNCEMENT')) {
            return <Activity className="h-4 w-4 text-teal-600" />;
        }
        return <Activity className="h-4 w-4 text-gray-600" />;
    };

    const filteredLogs = logs; // legacy support if needed

    // Get unique actions for filter dropdown
    const uniqueActions = [...new Set(logs.map(log => log.action))];

    const exportLogs = () => {
        // Create CSV content
        const headers = ['Timestamp', 'Action', 'Admin', 'Target Type', 'Target ID', 'IP Address'];
        const rows = logs.map(log => [
            new Date(log.createdAt).toLocaleString(),
            log.action,
            log.adminId?.name || 'Unknown',
            log.targetType,
            log.targetId || '',
            log.ipAddress || ''
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchAuditLogs}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={exportLogs}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export Logs</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'admin'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        Admin Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'user'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        User Logs
                    </button>
                </nav>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'admin' ? "Search by action, admin name..." : "Search by action, user email..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Actions</option>
                            {uniqueActions.map(action => (
                                <option key={action} value={action}>{action}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No audit logs found for {activeTab}
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {activeTab === 'admin' ? 'Admin User' : 'User'}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Address
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(log.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(log.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <div className="mr-3 mt-0.5">
                                                    {getActionIcon(log.action)}
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getActorIdentifier(log)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {getActorSubtext(log)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{log.targetType}</div>
                                            {log.targetId && (
                                                <div className="text-xs text-blue-600">{log.targetId}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">{log.ipAddress || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <p><span className="font-medium">Action:</span> {selectedLog.action}</p>
                                <p><span className="font-medium">Admin:</span> {selectedLog.adminId?.name || 'Unknown'} ({selectedLog.adminId?.email || 'N/A'})</p>
                                <p><span className="font-medium">Target Type:</span> {selectedLog.targetType}</p>
                                {selectedLog.targetId && <p><span className="font-medium">Target ID:</span> {selectedLog.targetId}</p>}
                                <p><span className="font-medium">Timestamp:</span> {new Date(selectedLog.createdAt).toLocaleString()}</p>
                                <p><span className="font-medium">IP Address:</span> {selectedLog.ipAddress || 'N/A'}</p>
                                {selectedLog.userAgent && <p><span className="font-medium">User Agent:</span> {selectedLog.userAgent}</p>}
                                {selectedLog.details && (
                                    <div>
                                        <span className="font-medium">Details:</span>
                                        <pre className="mt-2 p-2 bg-white rounded text-sm overflow-x-auto">
                                            {JSON.stringify(selectedLog.details, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
