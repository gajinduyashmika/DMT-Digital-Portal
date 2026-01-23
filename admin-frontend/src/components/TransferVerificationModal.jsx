import React, { useState } from 'react';
import axios from 'axios';
import { X, Check, AlertCircle, FileText, ChevronRight, User, Car, Calendar, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function TransferVerificationModal({ request, onClose, onRefresh }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [verification, setVerification] = useState(request.verification || {
        documentsVerified: false,
        paymentVerified: false,
        sellerIdentityVerified: false,
        buyerIdentityVerified: false,
        notes: ''
    });
    const [rejectReason, setRejectReason] = useState('');
    const [adminComments, setAdminComments] = useState('');
    const [action, setAction] = useState(null); // 'approve' | 'reject' | null

    const [fullRequest, setFullRequest] = useState(request);
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);

    // Fetch full details on mount to get complete vehicle info
    React.useEffect(() => {
        const fetchFullDetails = async () => {
            try {
                // const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/admin/transfers/${request._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFullRequest(res.data);
                // Update verification state from latest data if needed
                if (res.data.verification) {
                    setVerification(res.data.verification);
                }
            } catch (error) {
                console.error('Failed to fetch full details:', error);
            }
        };
        fetchFullDetails();
    }, [request._id]);

    const handleVerificationChange = (field) => {
        setVerification(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleUpdateVerification = async () => {
        try {
            // const token = localStorage.getItem('token');
            // Use fullRequest._id to be safe
            await axios.put(`${API_URL}/admin/transfers/${fullRequest._id}/verify`, { verification }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Verification progress saved successfully.');
        } catch (error) {
            console.error(error);
            alert('Failed to update verification: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleProcess = async (status) => {
        if (!confirm(`Are you sure you want to ${status} this request?`)) return;
        setLoading(true);
        try {
            // const token = localStorage.getItem('token');
            const endpoint = status === 'approved' ? 'approve' : 'reject';

            // Construct payload
            const payload = {
                adminComments: adminComments,
                adminNotes: verification.notes
            };
            if (status === 'rejected') {
                payload.rejectionReason = rejectReason;
            }

            await axios.put(`${API_URL}/admin/transfers/${fullRequest._id}/${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onRefresh();
            onClose();
        } catch (error) {
            console.error(error);
            alert(`Failed to ${status} request: ` + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">Transfer Verification</h2>
                            <StatusBadge status={fullRequest.status} />
                            {/* Buyer Approval Status Badge */}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${fullRequest.buyerApprovalStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                fullRequest.buyerApprovalStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                Buyer: {fullRequest.buyerApprovalStatus?.toUpperCase() || 'PENDING'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Request ID: {fullRequest._id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left: Comparison View */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                        {/* Vehicle Info */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    <Car className="w-4 h-4 text-blue-600" /> Vehicle Information
                                </h3>
                                <button
                                    onClick={() => setShowVehicleDetails(true)}
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                                >
                                    View Full Details
                                </button>
                            </div>
                            <div className={`rounded-xl p-4 border transition-all ${verification.documentsVerified ? 'bg-green-50/50 border-green-200' : 'bg-blue-50/50 border-blue-100'}`}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Registration Number</label>
                                        <p className="font-mono font-medium text-gray-900">{fullRequest.vehicleId?.regNumber}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Make & Model</label>
                                        <p className="font-medium text-gray-900">{fullRequest.vehicleId?.makeModel}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Chassis Number</label>
                                        <p className="font-mono text-sm text-gray-700">{fullRequest.vehicleId?.chassisNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Current Status</label>
                                        <p className="text-sm text-gray-700">{fullRequest.vehicleId?.status || 'Active'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seller vs Buyer Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Current Owner (Seller) */}
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    <User className="w-4 h-4 text-gray-600" /> Current Owner (Seller)
                                </h3>
                                <div className={`rounded-xl p-4 border space-y-3 transition-colors ${verification.sellerIdentityVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div>
                                        <label className="text-xs text-gray-500">Name</label>
                                        <p className="font-medium text-gray-900">{fullRequest.sellerId?.fullName || fullRequest.sellerId?.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">NIC / Passport</label>
                                        <p className="font-mono text-sm text-gray-700">{fullRequest.sellerId?.nid}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Address</label>
                                        <p className="text-sm text-gray-700">{fullRequest.sellerId?.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Known Email</label>
                                        <p className="text-sm text-gray-700">{fullRequest.sellerId?.email}</p>
                                    </div>
                                </div>
                            </section>

                            {/* New Owner (Buyer) */}
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                    <User className="w-4 h-4 text-green-600" /> New Owner (Buyer)
                                </h3>
                                <div className={`rounded-xl p-4 border space-y-3 transition-colors ${verification.buyerIdentityVerified ? 'bg-green-50 border-green-200' : 'bg-green-50/50 border-green-100'}`}>
                                    <div>
                                        <label className="text-xs text-gray-500">Name</label>
                                        <p className="font-medium text-gray-900">{fullRequest.buyerName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">NIC / Passport</label>
                                        <p className="font-mono text-sm text-gray-700">{fullRequest.buyerNIC}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Address</label>
                                        <p className="text-sm text-gray-700">{fullRequest.buyerAddress}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Contact</label>
                                        <p className="text-sm text-gray-700">{fullRequest.buyerEmail} <br /> {fullRequest.buyerMobile}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Sale Price</label>
                                        <p className="font-medium text-green-700">LKR {fullRequest.salePrice?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Documents */}
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                <FileText className="w-4 h-4 text-purple-600" /> Submitted Documents
                            </h3>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border transition-colors ${verification.documentsVerified ? 'bg-green-50 border-green-200' : 'border-transparent'}`}>
                                {Object.entries(fullRequest.documents || {}).map(([key, url]) => {
                                    if (!url) return null;
                                    return (
                                        <a
                                            key={key}
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 truncate capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                        </a>
                                    )
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Right: Verification & Action */}
                    <div className="w-full lg:w-96 bg-gray-50 p-6 flex flex-col border-l border-gray-100 h-full">
                        <h3 className="font-bold text-gray-900 mb-6">Verification Checklist</h3>

                        <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                            {Object.keys(verification).filter(k => k !== 'notes').map(key => (
                                <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${verification[key] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                        {verification[key] && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={verification[key]}
                                        onChange={() => handleVerificationChange(key)}
                                        disabled={fullRequest.status !== 'pending'}
                                    />
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </label>
                            ))}

                            <div className="pt-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Internal Notes</label>
                                <textarea
                                    value={verification.notes || ''}
                                    onChange={(e) => setVerification(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24"
                                    placeholder="Add notes for other admins..."
                                    disabled={fullRequest.status !== 'pending'}
                                />
                            </div>

                            {fullRequest.status === 'pending' && (
                                <button
                                    onClick={handleUpdateVerification}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Save Progress
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 space-y-3 pt-6 border-t border-gray-200">
                            {fullRequest.status === 'pending' ? (
                                <>
                                    {action === 'reject' ? (
                                        <div className="animate-fade-in space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Rejection Reason (Required)"
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                className="w-full text-sm p-2 border border-red-200 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            />
                                            <textarea
                                                placeholder="Comments for user (Optional)..."
                                                value={adminComments}
                                                onChange={(e) => setAdminComments(e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-200 rounded h-20 resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleProcess('rejected')}
                                                    disabled={!rejectReason || loading}
                                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    Confirm Reject
                                                </button>
                                                <button
                                                    onClick={() => setAction(null)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setAction('reject')}
                                                className="px-4 py-2.5 bg-white border border-red-200 text-red-700 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleProcess('approved')}
                                                disabled={fullRequest.buyerApprovalStatus !== 'approved'}
                                                className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={fullRequest.buyerApprovalStatus !== 'approved' ? "Buyer must approve first" : ""}
                                            >
                                                {fullRequest.buyerApprovalStatus !== 'approved' ? 'Wait for Buyer' : 'Approve Transfer'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-4 bg-gray-100 rounded-xl">
                                    <p className="text-sm text-gray-500">This request has been processed.</p>
                                    <p className="font-medium text-gray-900 mt-1 capitalize">{fullRequest.status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Full Details Modal */}
            {showVehicleDetails && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Full Vehicle Details</h3>
                            <button onClick={() => setShowVehicleDetails(false)}>
                                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Vehicle Image */}
                            {fullRequest.vehicleId?.vehicleImage && (
                                <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                                    <img src={fullRequest.vehicleId.vehicleImage} alt="Vehicle" className="w-full h-64 object-cover" />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Registration Info</h4>
                                    <dl className="space-y-2">
                                        <div><dt className="text-xs text-gray-400">Reg Number</dt><dd className="font-medium">{fullRequest.vehicleId?.regNumber}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Chassis Number</dt><dd className="font-medium">{fullRequest.vehicleId?.chassisNumber}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Engine Number</dt><dd className="font-medium">{fullRequest.vehicleId?.engineNumber}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Year of Manufacture</dt><dd className="font-medium">{fullRequest.vehicleId?.year}</dd></div>
                                    </dl>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Vehicle Specs</h4>
                                    <dl className="space-y-2">
                                        <div><dt className="text-xs text-gray-400">Make & Model</dt><dd className="font-medium">{fullRequest.vehicleId?.makeModel}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Vehicle Type</dt><dd className="font-medium">{fullRequest.vehicleId?.vehicleType}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Fuel Type</dt><dd className="font-medium">{fullRequest.vehicleId?.fuelType}</dd></div>
                                    </dl>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Owner Info (On Record)</h4>
                                    <dl className="space-y-2">
                                        <div><dt className="text-xs text-gray-400">Full Name</dt><dd className="font-medium">{fullRequest.vehicleId?.fullName}</dd></div>
                                        <div><dt className="text-xs text-gray-400">NIC</dt><dd className="font-medium">{fullRequest.vehicleId?.nid}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Email</dt><dd className="font-medium">{fullRequest.vehicleId?.ownerEmail}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Phone</dt><dd className="font-medium">{fullRequest.vehicleId?.phone}</dd></div>
                                        <div><dt className="text-xs text-gray-400">Address</dt><dd className="font-medium">{fullRequest.vehicleId?.address}</dd></div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowVehicleDetails(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
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
