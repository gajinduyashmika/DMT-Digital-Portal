import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '../../store/useStore';
import { Upload, Check, ArrowLeft, Clock, FileText, AlertCircle } from 'lucide-react';
import { SupportButton } from '../../components/SupportButton';

const translations = {
    en: {
        title: 'Transfer Vehicle Ownership',
        steps: {
            details: 'Enter Details',
            documents: 'Upload Documents',
            confirm: 'Confirmation',
        },
        form: {
            sellerName: 'Seller Full Name',
            sellerNid: 'Seller National ID / Passport No.',
            sellerEmail: 'Seller Email',
            sellerPhone: 'Seller Phone Number',
            buyerName: 'Buyer Full Name',
            buyerNid: 'Buyer National ID / Passport No.',
            buyerEmail: 'Buyer Email',
            buyerPhone: 'Buyer Phone Number',
            vehicleNumber: 'Current Vehicle Registration Number',
            transferReason: 'Transfer Reason',
            buyerAddress: 'Buyer Address',
            salePrice: 'Sale Price (LKR)',
        },
        documents: {
            sellerProof: "Seller's ID Copy",
            buyerProof: "Buyer's ID Copy",
            agreement: 'Sale Agreement / Deed of Transfer',
            inspection: 'Vehicle Inspection Report',
            insurance: 'Updated Insurance Document',
        },
        buttons: {
            next: 'Next Step',
            previous: 'Previous',
            submit: 'Submit Transfer Request',
        },
    },
    si: {
        title: 'වාහන අයිතිය මාරු කිරීම',
        steps: {
            details: 'විස්තර ඇතුළත් කරන්න',
            documents: 'ලේඛන උඩුගත කරන්න',
            confirm: 'තහවුරු කිරීම',
        },
        form: {
            sellerName: 'විකුණන්නාගේ සම්පූර්ණ නම',
            sellerNid: 'විකුණන්නාගේ ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර අංකය',
            sellerEmail: 'විකුණන්නාගේ විද්‍යුත් තැපෑල',
            sellerPhone: 'විකුණන්නාගේ දුරකථන අංකය',
            buyerName: 'මිලදී ගන්නාගේ සම්පූර්ණ නම',
            buyerNid: 'මිලදී ගන්නාගේ ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර අංකය',
            buyerEmail: 'මිලදී ගන්නාගේ විද්‍යුත් තැපෑල',
            buyerPhone: 'මිලදී ගන්නාගේ දුරකථන අංකය',
            vehicleNumber: 'වර්තමාන වාහන ලියාපදිංචි අංකය',
            transferReason: 'මාරු කිරීමේ හේතුව',
            buyerAddress: 'මිලදී ගන්නාගේ ලිපිනය',
            salePrice: 'විකුණුම් මිල (LKR)',
        },
        documents: {
            sellerProof: 'විකුණන්නාගේ හැඳුනුම්පත් පිටපත',
            buyerProof: 'මිලදී ගන්නාගේ හැඳුනුම්පත් පිටපත',
            agreement: 'විකිණීමේ ගිවිසුම / මාරු කිරීමේ ඔප්පුව',
            inspection: 'වාහන පරීක්ෂණ වාර්තාව',
            insurance: 'යාවත්කාලීන රක්ෂණ ලේඛනය',
        },
        buttons: {
            next: 'ඊළඟ පියවර',
            previous: 'පෙර',
            submit: 'මාරු කිරීමේ ඉල්ලීම යොමු කරන්න',
        },
    },
    ta: {
        title: 'வாகன உரிமை மாற்றம்',
        steps: {
            details: 'விவரங்களை உள்ளிடவும்',
            documents: 'ஆவணங்களை பதிவேற்றவும்',
            confirm: 'உறுதிப்படுத்தல்',
        },
        form: {
            sellerName: 'விற்பனையாளரின் முழு பெயர்',
            sellerNid: 'விற்பனையாளரின் தேசிய அடையாள அட்டை / கடவுச்சீட்டு எண்',
            sellerEmail: 'விற்பனையாளரின் மின்னஞ்சல்',
            sellerPhone: 'விற்பனையாளரின் தொலைபேசி எண்',
            buyerName: 'வாங்குபவரின் முழு பெயர்',
            buyerNid: 'வாங்குபவரின் தேசிய அடையாள அட்டை / கடவுச்சீட்டு எண்',
            buyerEmail: 'வாங்குபவரின் மின்னஞ்சல்',
            buyerPhone: 'வாங்குபவரின் தொலைபேசி எண்',
            vehicleNumber: 'தற்போதைய வாகன பதிவு எண்',
            transferReason: 'மாற்றத்திற்கான காரணம்',
            buyerAddress: 'வாங்குபவரின் விலாசம்',
            salePrice: 'விற்பனை விலை (LKR)',
        },
        documents: {
            sellerProof: 'விற்பனையாளரின் அடையாள அட்டை நகல்',
            buyerProof: 'வாங்குபவரின் அடையாள அட்டை நகல்',
            agreement: 'விற்பனை ஒப்பந்தம் / உரிமை மாற்ற பத்திரம்',
            inspection: 'வாகன ஆய்வு அறிக்கை',
            insurance: 'புதுப்பிக்கப்பட்ட காப்பீட்டு ஆவணம்',
        },
        buttons: {
            next: 'அடுத்த படி',
            previous: 'முந்தைய',
            submit: 'மாற்ற கோரிக்கையை சமர்ப்பிக்கவும்',
        },
    },
};

const transferReasons = ['Sale', 'Gift', 'Inheritance', 'Lease Return'];

/**
 * TransferVehicle Component
 * 
 * Handles the vehicle ownership transfer process.
 * Allows a seller to initiate a transfer request by providing buyer details
 * and uploading necessary documents.
 * 
 * Features:
 * - Multi-step form (Details -> Documents -> Confirm)
 * - Vehicle verification by registration number
 * - Document upload with preview (text)
 * - Transfer history view
 */
export const TransferVehicle = () => {
    const { language, isDarkMode } = useStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        sellerName: '',
        sellerNid: '',
        sellerEmail: '',
        sellerPhone: '',
        buyerName: '',
        buyerNid: '',
        buyerEmail: '',
        buyerPhone: '',
        vehicleNumber: '',
        transferReason: '',
        buyerAddress: '',
        salePrice: '',
    });

    const [verificationStatus, setVerificationStatus] = useState(null); // null, 'verifying', 'valid', 'invalid'
    const [vehicleId, setVehicleId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
    const [myRequests, setMyRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    useEffect(() => {
        if (activeTab === 'history') {
            fetchMyRequests();
        }
    }, [activeTab]);

    const fetchMyRequests = async () => {
        try {
            setLoadingRequests(true);
            const token = localStorage.getItem('token');
            const res = await api.get('/transfers/my-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRequests(res.data || []);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoadingRequests(false);
        }
    };


    const [documents, setDocuments] = useState({
        sellerProof: null,
        buyerProof: null,
        agreement: null,
        inspection: null,
        insurance: null,
    });

    /**
     * Verifies if the entered vehicle registration number exists and belongs to the user.
     * Sets the verification status and vehicle ID upon success.
     * 
     * @param {string} regNumber - The vehicle registration number to verify.
     */
    const verifyVehicle = async (regNumber) => {
        if (!regNumber) return;
        setVerificationStatus('verifying');
        try {
            const res = await api.get(`/vehicles/reg/${regNumber}`);
            if (res.data) {
                setVehicleId(res.data._id);
                setVerificationStatus('valid');
            }
        } catch (err) {
            console.error(err);
            setVerificationStatus('invalid');
            setVehicleId(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'vehicleNumber') {
            setVerificationStatus(null);
            setVehicleId(null);
        }
    };

    const handleBlur = (e) => {
        if (e.target.name === 'vehicleNumber') {
            verifyVehicle(e.target.value);
        }
    };

    const handleFileChange = (e, type) => {
        if (e.target.files?.[0]) {
            setDocuments({ ...documents, [type]: e.target.files[0] });
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    /**
     * Handles form submission for transfer request.
     * Converts documents to Base64 and sends the payload to the backend.
     * 
     * @param {Event} e - Form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vehicleId) {
            alert('Please enter a valid vehicle registration number.');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const documentPromises = Object.entries(documents).map(async ([key, file]) => {
                if (!file) return null;
                const base64 = await convertToBase64(file);
                // Map UI keys to backend enum if needed, but I updated backend to match keys approx
                // keys: sellerProof, buyerProof, agreement, inspection, insurance
                // enum: seller_proof, buyer_proof, agreement, inspection, insurance
                const typeMap = {
                    sellerProof: 'seller_proof',
                    buyerProof: 'buyer_proof',
                    agreement: 'agreement',
                    inspection: 'inspection',
                    insurance: 'insurance'
                };
                return {
                    type: typeMap[key],
                    url: base64
                };
            });

            const processedDocs = (await Promise.all(documentPromises)).filter(doc => doc !== null);

            const payload = {
                vehicleId,
                buyerNIC: formData.buyerNid,
                buyerName: formData.buyerName,
                buyerEmail: formData.buyerEmail,
                buyerMobile: formData.buyerPhone,
                buyerAddress: formData.buyerAddress,
                salePrice: Number(formData.salePrice) || 0,
                documents: processedDocs
            };

            await api.post('/transfers/request', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Transfer request submitted successfully!');
            // Reset form or redirect
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`rounded-2xl p-6 flex justify-between items-start ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                }`}>
                <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {translations[language].title}
                    </h1>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage vehicle ownership transfers securely
                    </p>
                </div>
                <SupportButton
                    context={{
                        type: 'transfer_vehicle',
                        reference: activeTab === 'new' ? 'New Transfer' : 'Transfer History',
                        title: 'Ownership Transfer Help'
                    }}
                    variant="outline"
                />
            </div>

            {/* Tabs */}
            <div className={`rounded-xl p-1 inline-flex ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'new'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('new')}
                >
                    New Request
                </button>
                <button
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'history'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setActiveTab('history')}
                >
                    My Requests
                </button>
            </div>

            {activeTab === 'history' ? (
                <div className="overflow-x-auto">
                    {loadingRequests ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : myRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No transfer requests found.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className={`text-xs uppercase bg-gray-50 dark:bg-gray-700 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <tr>
                                    <th className="px-6 py-3">Vehicle</th>
                                    <th className="px-6 py-3">Buyer NIC</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {myRequests.map(req => (
                                    <tr key={req._id} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        <td className="px-6 py-4">
                                            {req.vehicleId?.regNumber} <br />
                                            <span className="text-xs text-gray-500">{req.vehicleId?.makeModel}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{req.buyerNIC}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {req.status?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <>
                    {/* Progress Steps */}
                    <div className="mb-8 flex justify-between">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center ${step < currentStep
                                    ? 'text-green-500'
                                    : step === currentStep
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                    }`}
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step <= currentStep ? 'bg-current' : 'bg-gray-200'
                                        }`}
                                >
                                    {step < currentStep ? (
                                        <Check className="h-5 w-5 text-white" />
                                    ) : (
                                        <span className={step === currentStep ? 'text-white' : 'text-gray-500'}>
                                            {step}
                                        </span>
                                    )}
                                </div>
                                <span className="ml-2">
                                    {translations[language].steps[
                                        step === 1 ? 'details' : step === 2 ? 'documents' : 'confirm'
                                    ]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Details */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {Object.entries(translations[language].form).map(([key, label]) => (
                                    <div key={key} className={`relative ${key === 'buyerAddress' ? 'md:col-span-2' : ''}`}>
                                        {key === 'transferReason' ? (
                                            <select
                                                name={key}
                                                value={formData[key]}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-lg border p-2.5 ${isDarkMode
                                                    ? 'border-gray-600 bg-gray-700'
                                                    : 'border-gray-300 bg-white'
                                                    }`}
                                                required
                                            >
                                                <option value="">{label}</option>
                                                {transferReasons.map((reason) => (
                                                    <option key={reason} value={reason}>
                                                        {reason}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type={key.includes('Price') ? 'number' : key.includes('Email') ? 'email' : 'text'}
                                                    name={key}
                                                    value={formData[key]}
                                                    onChange={handleInputChange}
                                                    onBlur={key === 'vehicleNumber' ? handleBlur : undefined}
                                                    className={`w-full rounded-lg border p-2.5 ${isDarkMode
                                                        ? 'border-gray-600 bg-gray-700'
                                                        : 'border-gray-300 bg-white'}
                                                ${key === 'vehicleNumber' && verificationStatus === 'valid' ? 'border-green-500 ring-1 ring-green-500' : ''}
                                                ${key === 'vehicleNumber' && verificationStatus === 'invalid' ? 'border-red-500 ring-1 ring-red-500' : ''}
                                            `}
                                                    placeholder={label}
                                                    required
                                                />
                                                {key === 'vehicleNumber' && verificationStatus === 'verifying' && (
                                                    <div className="absolute right-3 top-2.5 animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></div>
                                                )}
                                                {key === 'vehicleNumber' && verificationStatus === 'valid' && (
                                                    <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Document Upload */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                {Object.entries(translations[language].documents).map(([key, label]) => (
                                    <div
                                        key={key}
                                        className={`rounded-lg border-2 border-dashed p-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                                            }`}
                                    >
                                        <label className="flex cursor-pointer items-center justify-center">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, key)}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            <div className="text-center">
                                                <Upload className="mx- auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2">{label}</p>
                                                <p className="text-sm text-gray-500">
                                                    {documents[key]
                                                        ? documents[key]?.name
                                                        : 'Click or drag file to upload'}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep === 3 && (
                            <div className={`rounded-lg border p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                }`}>
                                <h3 className="mb-4 text-lg font-semibold">Review Your Information</h3>
                                <div className="space-y-4">
                                    {Object.entries(formData).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="font-medium">
                                                {translations[language].form[key]}
                                            </span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                    <div className="mt-6">
                                        <h4 className="mb-2 font-medium">Uploaded Documents:</h4>
                                        {Object.entries(documents).map(([key, file]) => (
                                            <div key={key} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {
                                                        translations[language].documents[
                                                        key
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-between">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className={`rounded-lg px-4 py-2 ${isDarkMode
                                        ? 'bg-gray-700 hover:bg-gray-600'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {translations[language].buttons.previous}
                                </button>
                            )}
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    {translations[language].buttons.next}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    {translations[language].buttons.submit}
                                </button>
                            )}
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};
