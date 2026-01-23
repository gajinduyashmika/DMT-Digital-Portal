import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useToast } from '../../components/ToastContainer';
import { useStore } from '../../store/useStore';
import { Search, Eye, X, Car, ArrowRight, Download, ArrowRightLeft, ShieldCheck, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SecurityModal } from '../../components/SecurityModal';
import { CRVDocument } from '../../components/CRVDocument';
import { generatePDF } from '../../utils/pdfGenerator';
import { TransferRequestModal } from '../../components/TransferRequestModal';
import QRCode from 'react-qr-code';

const translations = {
    en: {
        title: 'My Vehicles',
        search: 'Search by registration number or type',
        columns: {
            regNo: 'Registration No.',
            type: 'Vehicle Type',
            makeModel: 'Make & Model',
            status: 'Status',
            actions: 'Actions',
        },
        buttons: {
            view: 'View Details',
            download: 'Download PDF',
            transfer: 'Transfer Ownership'
        },
        modal: {
            title: 'Vehicle Details',
            close: 'Close',
        },
    },
    // ... (Keep existing translations for si/ta or update them if I knew them. I'll just use English keys for now or fallback)
    si: {
        title: 'මගේ වාහන',
        search: 'ලියාපදිංචි අංකය හෝ වර්ගය අනුව සොයන්න',
        columns: {
            regNo: 'ලියාපදිංචි අංකය',
            type: 'වාහන වර්ගය',
            makeModel: 'නිෂ්පාදනය සහ මාදිලිය',
            status: 'තත්ත්වය',
            actions: 'ක්‍රියාමාර්ග',
        },
        buttons: {
            view: 'විස්තර බලන්න',
            download: 'PDF බාගත කරන්න',
            transfer: 'හිමිකාරිත්වය මාරු කරන්න'
        },
        modal: {
            title: 'වාහන විස්තර',
            close: 'වසන්න',
        },
    },
    ta: {
        title: 'எனது வாகனங்கள்',
        search: 'பதிவு எண் அல்லது வகை மூலம் தேடுங்கள்',
        columns: {
            regNo: 'பதிவு எண்',
            type: 'வாகன வகை',
            makeModel: 'தயாரிப்பு & மாதிரி',
            status: 'நிலை',
            actions: 'செயல்கள்',
        },
        buttons: {
            view: 'விவரங்களைக் காண்க',
            download: 'PDF பதிவிறக்கம்',
            transfer: 'உரிமையை மாற்றவும்'
        },
        modal: {
            title: 'வாகன விவரங்கள்',
            close: 'மூடு',
        },
    },
};

export const MyVehicles = () => {
    const { language, isDarkMode } = useStore();
    const { showToast } = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [qrVehicle, setQrVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Transfer Modal State
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferVehicle, setTransferVehicle] = useState(null);

    // CRV Download states
    const [downloadingVehicle, setDownloadingVehicle] = useState(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const crvRef = useRef(null);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                showToast('error', 'User session expired. Please login again');
                setLoading(false);
                return;
            }
            const baseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
            const res = await axios.get(`${baseUrl}/api/vehicles/owner/${userEmail}`);
            setVehicles(res.data || []);
        } catch (err) {
            console.error('Error loading vehicles:', err);
            showToast('error', 'Failed to load vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const handleDownloadClick = (vehicle) => {
        setDownloadingVehicle(vehicle);
        setShowSecurityModal(true);
    };

    const handleTransferClick = (vehicle) => {
        setTransferVehicle(vehicle);
        setShowTransferModal(true);
    };

    const handleTransferSuccess = () => {
        loadVehicles(); // Reload to show updated status (e.g. Pending Transfer)
    };

    const handleViewDetails = async (vehicleLite) => {
        setSelectedVehicle(vehicleLite);
        setLoadingDetails(true);
        try {
            const baseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
            // 1. Fetch Metadata
            const res = await axios.get(`${baseUrl}/api/vehicles/${vehicleLite._id}`);
            setSelectedVehicle(res.data);

            // 2. Fetch Resources Async
            axios.get(`${baseUrl}/api/vehicles/${vehicleLite._id}/resources`)
                .then(resourceRes => {
                    setSelectedVehicle(prev => ({
                        ...prev,
                        documents: resourceRes.data.documents,
                        vehicleImage: resourceRes.data.vehicleImage
                    }));
                })
                .catch(err => console.error("Failed to load vehicle resources", err));

        } catch (error) {
            console.error("Failed to fetch vehicle details", error);
            showToast('error', 'Failed to load full vehicle details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSecuritySuccess = async () => {
        setShowSecurityModal(false);
        showToast('success', 'Generating CRV Document...');

        // Wait for state update and render
        setTimeout(async () => {
            const success = await generatePDF(crvRef, `CRV_${downloadingVehicle.regNumber}.pdf`);
            if (success) {
                showToast('success', 'CRV Downloaded Successfully');
            } else {
                showToast('error', 'Failed to generate PDF');
            }
            setDownloadingVehicle(null);
        }, 500); // 500ms delay to ensure re-render
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const term = searchTerm.toLowerCase();
        return (
            vehicle.regNumber?.toLowerCase().includes(term) ||
            vehicle.vehicleType?.toLowerCase().includes(term) ||
            vehicle.makeModel?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-6 p-1">

            {/* Header */}
            <div className={`rounded-2xl p-6 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {translations[language].title}
                        </h1>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            View and manage all your registered vehicles
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadVehicles}
                            className={`p-2.5 rounded-xl transition-all ${isDarkMode
                                ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            title="Refresh List"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <Link
                            to="/register-vehicle"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 transition-all duration-300"
                        >
                            Register New
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className={`rounded-2xl p-6 ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100'
                }`}>
                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                    <input
                        type="text"
                        placeholder={translations[language].search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full rounded-xl border pl-12 pr-4 py-3.5 transition-all ${isDarkMode
                            ? 'border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:bg-white/10'
                            : 'border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-red-500/30 focus:bg-white'
                            } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                    />
                </div>
            </div>

            {/* Vehicles Table */}
            <div className={`rounded-2xl overflow-hidden ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
                        <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading vehicles...</p>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                            }`}>
                            <Car className={`h-8 w-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No vehicles found</p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Register a vehicle to see it here
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                                    {Object.values(translations[language].columns).map((column) => (
                                        <th key={column} className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredVehicles.map((vehicle) => (
                                    <tr
                                        key={vehicle._id}
                                        className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {vehicle.regNumber}
                                            <div className="text-[10px] text-gray-400 font-mono mt-1">
                                                Owner: {vehicle.ownerEmail}<br />
                                                You: {localStorage.getItem('userEmail')}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {vehicle.vehicleType}
                                        </td>
                                        <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {vehicle.makeModel}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase() ? (
                                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium w-fit bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                                                        Transferred (Sold)
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium w-fit ${(vehicle.status?.toLowerCase() === 'approved' || vehicle.status?.toLowerCase() === 'active')
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                                                : vehicle.status?.toLowerCase() === 'rejected'
                                                                    ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                                }`}
                                                        >
                                                            {vehicle.status || 'Pending'}
                                                        </span>
                                                        {vehicle.transferStatus && vehicle.transferStatus !== 'None' && (
                                                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                                {vehicle.transferStatus}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(vehicle)}
                                                    disabled={vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase()}
                                                    className={`p-2 rounded-lg transition-colors ${vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase()
                                                        ? 'opacity-30 cursor-not-allowed bg-gray-100 dark:bg-white/5 text-gray-400'
                                                        : isDarkMode
                                                            ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                                                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                                        }`}
                                                    title={vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase() ? "Access Restricted (Sold)" : translations[language].buttons.view}
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQrVehicle(vehicle);
                                                    }}
                                                    className="p-2 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                                    title="Digital Certificate"
                                                >
                                                    <QrCode size={20} />
                                                </button>
                                                {(vehicle.status?.toLowerCase() === 'approved' || vehicle.status?.toLowerCase() === 'active') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDownloadClick(vehicle)}
                                                            disabled={vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase()}
                                                            className={`p-2 rounded-lg transition-colors ${vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase()
                                                                ? 'opacity-30 cursor-not-allowed bg-gray-100 dark:bg-white/5 text-gray-400'
                                                                : isDarkMode
                                                                    ? 'hover:bg-white/10 text-blue-400 hover:text-blue-300'
                                                                    : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                                                                }`}
                                                            title={vehicle.ownerEmail?.toLowerCase() !== localStorage.getItem('userEmail')?.toLowerCase() ? "Access Restricted (Sold)" : translations[language].buttons.download}
                                                        >
                                                            <Download className="h-5 w-5" />
                                                        </button>
                                                        {/* Hide Transfer button entirely if Sold */}
                                                        {vehicle.ownerEmail?.toLowerCase() === localStorage.getItem('userEmail')?.toLowerCase() && (!vehicle.transferStatus || vehicle.transferStatus === 'None' || vehicle.transferStatus === 'Completed') && (
                                                            <button
                                                                onClick={() => handleTransferClick(vehicle)}
                                                                className={`p-2 rounded-lg transition-colors ${isDarkMode
                                                                    ? 'hover:bg-white/10 text-emerald-400 hover:text-emerald-300'
                                                                    : 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700'
                                                                    }`}
                                                                title={translations[language].buttons.transfer}
                                                            >
                                                                <ArrowRightLeft className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Hidden CRV Document for Generation */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                {downloadingVehicle && (
                    <CRVDocument ref={crvRef} vehicle={downloadingVehicle} />
                )}
            </div>

            {/* Security Modal */}
            <SecurityModal
                isOpen={showSecurityModal}
                onClose={() => setShowSecurityModal(false)}
                onSuccess={handleSecuritySuccess}
                title="Download CRV Verification"
                description="Enter your credentials to download the Vehicle Registration Certificate."
                actionText="Verify & Download"
            />

            {/* Transfer Request Modal */}
            <TransferRequestModal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                vehicle={transferVehicle}
                onSuccess={handleTransferSuccess}
            />

            {/* Vehicle Details Modal */}
            {selectedVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className={`w-full max-w-3xl rounded-2xl shadow-2xl ${isDarkMode
                        ? 'bg-gray-900 text-white border border-white/5'
                        : 'bg-white text-gray-900'
                        }`}>
                        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-white/5">
                            <div>
                                <p className={`text-sm uppercase tracking-wide font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {translations[language].modal.title}
                                </p>
                                <h3 className="text-2xl font-bold mt-1">{selectedVehicle.makeModel}</h3>
                                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedVehicle.vehicleType}</p>
                            </div>
                            <button
                                onClick={() => setSelectedVehicle(null)}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode
                                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {loadingDetails ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Registration No.</p>
                                            <p className="font-semibold text-lg">{selectedVehicle.regNumber}</p>
                                            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Owner Email</p>
                                            <p className="font-semibold text-sm">{selectedVehicle.ownerEmail}</p>
                                        </div>
                                        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chassis No.</p>
                                            <p className="font-semibold">{selectedVehicle.chassisNumber}</p>
                                            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Engine No.</p>
                                            <p className="font-semibold">{selectedVehicle.engineNumber}</p>
                                        </div>
                                    </div>

                                    {/* Previous Owners Section */}
                                    {selectedVehicle.previousOwners && selectedVehicle.previousOwners.length > 0 && (
                                        <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Previous Owners History (Total: {selectedVehicle.previousOwners.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedVehicle.previousOwners.map((owner, idx) => (
                                                    <div key={idx} className={`p-3 rounded-lg border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}>
                                                        <p className="font-medium text-sm">{owner.fullName}</p>
                                                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{owner.address}</p>
                                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            Transferred on: {new Date(owner.transferredAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Details</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                            {/* ... existing fields ... */}
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Year</p>
                                                <p className="font-semibold">{selectedVehicle.year}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Fuel Type</p>
                                                <p className="font-semibold">{selectedVehicle.fuelType}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Current Owners</p>
                                                <p className="font-semibold">{selectedVehicle.owners}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Ownership</p>
                                                <p className="font-semibold">{selectedVehicle.ownershipType}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Status</p>
                                                <p className="font-semibold">{selectedVehicle.status}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Transfer</p>
                                                <p className="font-semibold">{selectedVehicle.transferStatus}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Created</p>
                                                <p className="font-semibold text-xs">{new Date(selectedVehicle.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Updated</p>
                                                <p className="font-semibold text-xs">{new Date(selectedVehicle.updatedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button
                                onClick={() => setSelectedVehicle(null)}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${isDarkMode
                                    ? 'bg-white/5 text-white hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <X className="w-4 h-4" />
                                {translations[language].modal.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Digital Certificate Modal */}
            {qrVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <button
                                onClick={() => setQrVehicle(null)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex justify-center mb-3">
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
                                    <ShieldCheck size={32} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold">Digital Vehicle ID</h2>
                            <p className="text-blue-100 text-sm mt-1">Official Proof of Registration</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-6">
                                <QRCode
                                    value={`${window.location.origin}/verify/${qrVehicle.regNumber}`}
                                    size={180}
                                    level="H"
                                    fgColor="#000000"
                                    bgColor="#FFFFFF"
                                />
                            </div>

                            <div className="text-center w-full">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Registration No</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{qrVehicle.regNumber}</p>
                                </div>

                                <div className="flex justify-between text-sm w-full px-4 mb-2">
                                    <span className="text-gray-500">Vehicle</span>
                                    <span className="font-medium dark:text-gray-200">{qrVehicle.makeModel}</span>
                                </div>
                                <div className="flex justify-between text-sm w-full px-4">
                                    <span className="text-gray-500">Owner</span>
                                    <span className="font-medium dark:text-gray-200">{qrVehicle.fullName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-400">Scan to verify vehicle details instantly.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
