import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
    Car,
    FileCheck,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    MessageCircle,
    Bell,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    BarChart3
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalVehicles: 0,
        pendingApplications: 0,
        totalUsers: 0,
        openTickets: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
            setRecentApplications(response.data.recentApplications || []);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            name: 'Total Vehicles',
            value: stats.totalVehicles.toString(),
            change: '+4.5%',
            trend: 'up',
            icon: Car,
            gradient: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            name: 'Pending Verifications',
            value: stats.pendingApplications.toString(),
            change: '-2.1%',
            trend: 'down',
            icon: Clock,
            gradient: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            name: 'Active Users',
            value: stats.totalUsers.toString(),
            change: '+12.3%',
            trend: 'up',
            icon: Users,
            gradient: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            name: 'Open Tickets',
            value: stats.openTickets.toString(),
            change: '+0.8%',
            trend: 'up',
            icon: AlertTriangle,
            gradient: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600'
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            'Approved': 'badge badge-success',
            'Pending': 'badge badge-warning',
            'Rejected': 'badge badge-error',
            'Under Review': 'badge badge-info'
        };
        return badges[status] || 'badge';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner h-16 w-16"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="card p-6 card-hover group">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                                <div className="flex items-baseline space-x-2">
                                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                    <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.trend === 'up' ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4" />
                                        )}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`} style={{ width: '70%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applications by Status */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Applications Status</h3>
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Approved</p>
                                    <p className="text-xs text-gray-500">This month</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{stats.approvedApplications}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Pending</p>
                                    <p className="text-xs text-gray-500">Awaiting review</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{stats.pendingApplications}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Rejected</p>
                                    <p className="text-xs text-gray-500">This month</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{stats.rejectedApplications}</span>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                        <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Server Uptime</span>
                                <span className="text-sm font-semibold text-green-600">99.9%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '99.9%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Response Time</span>
                                <span className="text-sm font-semibold text-green-600">125ms</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Database Load</span>
                                <span className="text-sm font-semibold text-amber-600">42%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">API Status</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-600">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/vehicles" className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <FileCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Review Applications</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                        <Link to="/users" className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Manage Users</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </Link>
                        <Link to="/announcements" className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Bell className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Send Notification</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        </Link>
                        <Link to="/chat" className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all group">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MessageCircle className="h-5 w-5 text-amber-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Live Chat</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Applications */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle Class</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentApplications.length > 0 ? (
                                recentApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">
                                                        {app.ownerName?.charAt(0) || 'A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{app.ownerName}</p>
                                                    <p className="text-xs text-gray-500">{app.ownerEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{app.vehicleClass}</td>
                                        <td className="py-3 px-4">
                                            <span className={getStatusBadge(app.status)}>{app.status}</span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        No recent applications
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
