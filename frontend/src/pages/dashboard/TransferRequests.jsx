import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../../store/useStore';
import { ArrowLeftRight, Clock, CheckCircle, XCircle, FileText, Search, AlertCircle, Calendar, ArrowDownLeft, ArrowUpRight, Eye } from 'lucide-react';
import { IncomingRequestModal } from '../../components/IncomingRequestModal';

const translations = {
    en: {
        title: 'Transfer Requests',
        subtitle: 'Track your vehicle ownership transfer applications',
        table: {
            vehicle: 'Vehicle',
            buyer: 'Counterpart',
            price: 'Sale Price',
            status: 'Status',
            date: 'Date',
            actions: 'Actions'
        },
        status: {
            pending: 'Pending Review',
            approved: 'Approved',
            rejected: 'Rejected',
            cancelled: 'Cancelled'
        }
    },
    si: {
        title: 'මාරු කිරීමේ ඉල්ලීම්',
        subtitle: 'ඔබගේ වාහන අයිතිය මාරු කිරීමේ අයදුම්පත්',
        table: {
            vehicle: 'වාහනය',
            buyer: 'ගැනුම්කරු',
            price: 'විකුණුම් මිල',
            status: 'තත්ත්වය',
            date: 'දිනය',
            actions: 'ක්‍රියාමාර්ග'
        },
        status: {
            pending: 'සලකා බලමින් පවතී',
            approved: 'අනුමත කර ඇත',
            rejected: 'ප්‍රතික්ෂේප කර ඇත',
            cancelled: 'අවලංගු කර ඇත'
        }
    },
    ta: {
        title: 'மாற்ற கோரிக்கைகள்',
        subtitle: 'உங்கள் வாகன உரிமை மாற்ற விண்ணப்பங்களைக் கண்காணிக்கவும்',
        table: {
            vehicle: 'வாகனம்',
            buyer: 'வாங்குபவர்',
            price: 'விற்பனை விலை',
            status: 'நிலை',
            date: 'தேதி',
            actions: 'செயல்கள்'
        },
        status: {
            pending: 'நிலுவையில் உள்ள மதிப்பாய்வு',
            approved: 'அங்கீகரிக்கப்பட்டது',
            rejected: 'நிராகரிக்கப்பட்டது',
            cancelled: 'ரத்து செய்யப்பட்டது'
        }
    }
};

export const TransferRequests = () => {
    const { language, isDarkMode } = useStore();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('incoming');
    const [selectedIncomingRequest, setSelectedIncomingRequest] = useState(null);

    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/transfers/my-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data || []);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyerAction = async (requestId, action) => {
        if (!confirm(`Are you sure you want to ${action} this transfer request?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/transfers/${requestId}/respond`, { action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Transfer request ${action}ed successfully.`);
            fetchRequests();
            setSelectedIncomingRequest(null);
        } catch (error) {
            console.error('Action failed:', error);
            alert('Failed to process request: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    // Filter Logic
    const incomingRequests = requests.filter(r => r.buyerEmail === userEmail);
    const sentRequests = requests.filter(r => r.buyerEmail !== userEmail);

    const displayedRequests = (activeTab === 'incoming' ? incomingRequests : sentRequests).filter(req =>
        req.vehicleId?.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'sent' ? req.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) : req.sellerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-fade-in p-1">
            {/* Header */}
            <div className={`rounded-2xl p-6 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {translations[language].title}
                        </h1>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {translations[language].subtitle}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 mt-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('incoming')}
                        className={`pb-3 px-4 text-sm font-medium transition-all relative ${activeTab === 'incoming'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <ArrowDownLeft className="w-4 h-4" />
                            Incoming Requests
                            {incomingRequests.length > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                                    {incomingRequests.length}
                                </span>
                            )}
                        </span>
                        {activeTab === 'incoming' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`pb-3 px-4 text-sm font-medium transition-all relative ${activeTab === 'sent'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <ArrowUpRight className="w-4 h-4" />
                            Sent Requests
                        </span>
                        {activeTab === 'sent' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className={`rounded-2xl overflow-hidden ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}>

                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5">
                    <div className="relative max-w-md">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder={activeTab === 'incoming' ? "Search by Seller or Reg No..." : "Search by Buyer or Reg No..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDarkMode
                                ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                                }`}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    </div>
                ) : displayedRequests.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <ArrowLeftRight className={`h-8 w-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>No {activeTab === 'incoming' ? 'Incoming' : 'Sent'} Requests</h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {activeTab === 'incoming' ? "You don't have any incoming transfer requests." : "You haven't initiated any transfers."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {translations[language].table.vehicle}
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {activeTab === 'incoming' ? 'Seller (From)' : 'Buyer (To)'}
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {translations[language].table.price}
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {translations[language].table.status}
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {translations[language].table.date}
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {translations[language].table.actions}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {displayedRequests.map((req) => (
                                    <tr
                                        key={req._id}
                                        className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                    <FileText className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {req.vehicleId?.regNumber || 'Unknown'}
                                                    </p>
                                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {req.vehicleId?.makeModel}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {activeTab === 'incoming' ? (req.sellerId?.fullName || 'Unknown') : req.buyerName}
                                                </p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {activeTab === 'incoming' ? (req.sellerId?.email) : req.buyerEmail}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                LKR {req.salePrice?.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    {translations[language].status[req.status] || req.status}
                                                </span>
                                                {/* Buyer Status Tag */}
                                                <span className={`text-[10px] font-medium uppercase tracking-wider ${req.buyerApprovalStatus === 'approved' ? 'text-green-600' :
                                                        req.buyerApprovalStatus === 'rejected' ? 'text-red-600' : 'text-amber-600'
                                                    }`}>
                                                    Buyer: {req.buyerApprovalStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <Calendar className="w-4 h-4" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {activeTab === 'incoming' ? (
                                                <button
                                                    onClick={() => setSelectedIncomingRequest(req)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">View Only</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <IncomingRequestModal
                isOpen={!!selectedIncomingRequest}
                onClose={() => setSelectedIncomingRequest(null)}
                request={selectedIncomingRequest}
                onAction={handleBuyerAction}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};
