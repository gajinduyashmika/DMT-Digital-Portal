import React from 'react';
import { X, User, Car, Calendar, DollarSign, Phone, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';
import { SupportButton } from './SupportButton';

export const IncomingRequestModal = ({ isOpen, onClose, request, onAction, isDarkMode }) => {
    if (!isOpen || !request) return null;

    const { vehicleId, sellerId, salePrice, createdAt, status } = request;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

                {/* Header */}
                <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">Incoming Transfer Request</h2>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase">
                                Incoming
                            </span>
                        </div>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Review details before accepting ownership
                        </p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Vehicle Details */}
                    <section className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-70">
                            <Car className="w-4 h-4" /> Vehicle Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs opacity-60">Registration No</label>
                                <p className="font-mono text-lg font-bold">{vehicleId?.regNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs opacity-60">Make & Model</label>
                                <p className="font-medium text-lg">{vehicleId?.makeModel || 'N/A'}</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Seller Details */}
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-70">
                                <User className="w-4 h-4" /> Seller Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                        <User className="w-5 h-5 opacity-70" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{sellerId?.fullName || 'Unknown'}</p>
                                        <p className="text-xs opacity-60">Current Owner</p>
                                    </div>
                                </div>
                                <div className="space-y-2 pl-2">
                                    <p className="text-sm flex items-center gap-2 opacity-80">
                                        <Mail className="w-3.5 h-3.5" /> {sellerId?.email}
                                    </p>
                                    <p className="text-sm flex items-center gap-2 opacity-80">
                                        <Phone className="w-3.5 h-3.5" /> {sellerId?.phone}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Transaction Details */}
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 opacity-70">
                                <FileText className="w-4 h-4" /> Transaction Info
                            </h3>
                            <div className={`p-4 rounded-xl space-y-3 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                <div>
                                    <label className="text-xs opacity-60">Sale Price</label>
                                    <p className={`text-xl font-bold flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                        LKR {salePrice?.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs opacity-60">Request Date</label>
                                    <div className="flex items-center gap-2 mt-1 font-medium text-sm">
                                        <Calendar className="w-4 h-4 opacity-70" />
                                        {new Date(createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Terms / Warning */}
                    <div className={`p-4 rounded-xl text-sm ${isDarkMode ? 'bg-amber-500/10 text-amber-200' : 'bg-amber-50 text-amber-800'}`}>
                        <p className="font-bold mb-1">Attention:</p>
                        <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li>By accepting, you confirm the details are correct.</li>
                            <li>The transfer will be sent to DMT Admin for final verification.</li>
                            <li>You cannot undo this action once accepted.</li>
                        </ul>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className={`p-6 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                    {request.buyerApprovalStatus === 'pending' && status === 'pending' ? (
                        <>
                            <button
                                onClick={() => onAction(request._id, 'reject')}
                                className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                            >
                                Reject Request
                            </button>
                            <button
                                onClick={() => onAction(request._id, 'approve')}
                                className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Accept & Proceed
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <SupportButton
                                context={{
                                    type: 'transfer_request',
                                    id: request._id,
                                    reference: request.vehicleId?.regNumber || 'Unknown',
                                    title: `Transfer Request - ${request.vehicleId?.regNumber}`
                                }}
                                variant="outline"
                                label="Need Help?"
                            />
                            <div className="flex items-center gap-2 opacity-70">
                                Status: <span className="font-bold uppercase">{request.buyerApprovalStatus}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
