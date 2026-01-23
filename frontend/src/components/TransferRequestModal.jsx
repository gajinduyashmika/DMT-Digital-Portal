import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from './ToastContainer';

// import { compressImage } from '../utils/imageCompressor'; // Removed

export const TransferRequestModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const [formData, setFormData] = useState({
        buyerNIC: '',
        buyerName: '',
        buyerEmail: '',
        buyerMobile: '',
        buyerAddress: '',
        salePrice: ''
    });
    const [documents, setDocuments] = useState({
        transferForm: null,
        sellerNicCopy: null,
        buyerNicCopy: null,
        revenueLicense: null,
        insuranceCopy: null,
        other: null
    });

    if (!isOpen || !vehicle) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, docType) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > MAX_FILE_SIZE) {
                showToast('error', `File size too large. Maximum allowed size is 5MB.`);
                e.target.value = null; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setDocuments(prev => ({ ...prev, [docType]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!documents.transferForm || !documents.sellerNicCopy || !documents.buyerNicCopy) {
            showToast('error', 'Please upload all required documents (Transfer Form, Seller NIC, Buyer NIC).');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                vehicleId: vehicle._id,
                ...formData,
                documents
            };

            await axios.post('http://localhost:5000/api/transfers/initiate', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast('success', 'Transfer request submitted successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Transfer request error:', error);
            showToast('error', error.response?.data?.message || 'Failed to submit transfer request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">Request Ownership Transfer</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Transferring ownership of {vehicle.makeModel} ({vehicle.regNumber})
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="transferForm" onSubmit={handleSubmit} className="space-y-8">

                        {/* Validations / Info */}
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                                <p className="font-semibold mb-1">Important Notice</p>
                                <ul className="list-disc list-inside space-y-1 opacity-90">
                                    <li>Ensure the new owner's details are accurate.</li>
                                    <li>Upload clear scans of the signed MTA 6 / MTA 8 Transfer Forms.</li>
                                    <li>Both Seller and Buyer NIC copies are mandatory.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Buyer Information Section */}
                        <section>
                            <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">1</span>
                                New Owner Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">National ID (NIC) *</label>
                                    <input
                                        type="text"
                                        name="buyerNIC"
                                        value={formData.buyerNIC}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., 199012345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        name="buyerName"
                                        value={formData.buyerName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Full legal name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                                    <input
                                        type="email"
                                        name="buyerEmail"
                                        value={formData.buyerEmail}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobile Number *</label>
                                    <input
                                        type="tel"
                                        name="buyerMobile"
                                        value={formData.buyerMobile}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="07X XXX XXXX"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Permanent Address *</label>
                                    <textarea
                                        name="buyerAddress"
                                        value={formData.buyerAddress}
                                        onChange={handleInputChange}
                                        required
                                        rows={2}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="House No, Street, City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sale Price (LKR) *</label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g., 5,000,000"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Document Uploads */}
                        <section>
                            <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs">2</span>
                                Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FileUploadField
                                    label="Transfer Form (MTA 6/8)"
                                    name="transferForm"
                                    value={documents.transferForm}
                                    onChange={handleFileChange}
                                    required
                                />
                                <FileUploadField
                                    label="Seller NIC Copy"
                                    name="sellerNicCopy"
                                    value={documents.sellerNicCopy}
                                    onChange={handleFileChange}
                                    required
                                />
                                <FileUploadField
                                    label="Buyer NIC Copy"
                                    name="buyerNicCopy"
                                    value={documents.buyerNicCopy}
                                    onChange={handleFileChange}
                                    required
                                />
                                <FileUploadField
                                    label="Revenue License (Current)"
                                    name="revenueLicense"
                                    value={documents.revenueLicense}
                                    onChange={handleFileChange}
                                />
                                <FileUploadField
                                    label="Insurance Copy"
                                    name="insuranceCopy"
                                    value={documents.insuranceCopy}
                                    onChange={handleFileChange}
                                />
                                <FileUploadField
                                    label="Other Documents"
                                    name="other"
                                    value={documents.other}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </section>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="transferForm"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper Component for File Upload
const FileUploadField = ({ label, name, value, onChange, required }) => (
    <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${value
            ? 'border-green-500/50 bg-green-50 dark:bg-green-500/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800'
            }`}>
            <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => onChange(e, name)}
                required={required}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${value ? 'bg-green-100 text-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {value ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${value ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                        {value ? 'Document Uploaded' : 'Click to upload'}
                    </p>
                    {!value && <p className="text-xs text-gray-400">JPG, PNG or PDF (Max 5MB)</p>}
                </div>
            </div>
        </div>
    </div>
);
