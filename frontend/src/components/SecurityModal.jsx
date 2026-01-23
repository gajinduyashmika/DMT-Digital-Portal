import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const SecurityModal = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Security Verification",
    description = "Please verify your identity to proceed.",
    actionText = "Verify & Proceed"
}) => {
    const [password, setPassword] = useState('');
    const [nic, setNic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call the verification endpoint
            // Note: Adjust the endpoint as per backend implementation
            const response = await axios.post('http://localhost:5000/api/auth/verify-security', {
                password,
                nic
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                }
            });

            if (response.data.success) {
                toast.success('Verification Successful');
                onSuccess();
                onClose();
            } else {
                setError('Verification failed. Please check your credentials.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-700/50 p-2 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{title}</h3>
                            <p className="text-blue-200 text-sm mt-0.5">{description}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-blue-200 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center animate-in slide-in-from-top-2">
                            <X className="w-4 h-4 mr-2 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder="Enter your login password"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">National ID (NIC)</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder="Enter your NIC number"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 px-4 rounded-lg text-white font-medium shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0
                                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                                    Verifying...
                                </span>
                            ) : (
                                actionText
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Secure verification powered by DMT Digital Portal
                    </p>
                </div>
            </div>
        </div>
    );
};
