import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftRight, Search, Filter, RefreshCw, FileText, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import TransferVerificationModal from './TransferVerificationModal';

import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function OwnershipTransfers() {
    const { token } = useAuth(); // Get token from context
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        if (token) fetchTransfers();
    }, [token]); // Add token dependency

    const fetchTransfers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/admin/transfers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransfers(res.data.transfers || []);
        } catch (error) {
            console.error('Failed to fetch transfers:', error);
            if (error.response?.status !== 401) {
                // let global interceptor handle 401
                // alert('Failed to fetch data'); 
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredTransfers = transfers.filter(t => {
        const matchesSearch =
            t.vehicleId?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.buyerNIC?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ownership Transfers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and verify vehicle ownership transfer requests</p>
                </div>
                <button
                    onClick={fetchTransfers}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: transfers.length, color: 'blue', icon: FileText },
                    { label: 'Pending Review', value: transfers.filter(t => t.status === 'pending').length, color: 'yellow', icon: Clock },
                    { label: 'Approved', value: transfers.filter(t => t.status === 'approved').length, color: 'green', icon: CheckCircle },
                    { label: 'Rejected', value: transfers.filter(t => t.status === 'rejected').length, color: 'red', icon: XCircle }
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Vehicle No, Buyer Name or NIC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredTransfers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No transfer requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransfers.map((t) => (
                                    <tr key={t._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <ArrowLeftRight className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{t.vehicleId?.regNumber || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{t.vehicleId?.makeModel}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{t.buyerName}</p>
                                                <p className="text-xs text-gray-500 font-mono">{t.buyerNIC}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 font-medium">LKR {t.salePrice?.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(t.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                                                {t.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedRequest(t)}
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 group-hover:bg-blue-100"
                                            >
                                                Details <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedRequest && (
                <TransferVerificationModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onRefresh={fetchTransfers}
                />
            )}
        </div>
    );
}
