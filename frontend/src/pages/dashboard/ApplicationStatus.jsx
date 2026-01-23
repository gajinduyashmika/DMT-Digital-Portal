import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Eye, AlertCircle, CheckCircle, Clock, X, Download, FileText, ZoomIn, ZoomOut, RefreshCw, Trash2, Edit, XCircle, MessageSquare } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import axios from 'axios';
import jsPDF from 'jspdf';

const translations = {
    en: {
        title: 'Application Status',
        columns: {
            id: 'Application ID',
            vehicleNo: 'Vehicle No.',
            type: 'Type',
            status: 'Status',
            lastUpdated: 'Last Updated',
            actions: 'Actions',
        },
        status: {
            submitted: 'Submitted',
            review: 'Under Review',
            verification: 'Document Verification',
            approved: 'Approved',
        },
        buttons: {
            view: 'View Details',
            refresh: 'Refresh',
        },
    },
    si: {
        title: 'අයදුම්පත් තත්ත්වය',
        columns: {
            id: 'අයදුම්පත් ID',
            vehicleNo: 'වාහන අංකය',
            type: 'වර්ගය',
            status: 'තත්ත්වය',
            lastUpdated: 'අවසන් යාවත්කාලීන කිරීම',
            actions: 'ක්‍රියාමාර්ග',
        },
        status: {
            submitted: 'ඉදිරිපත් කර ඇත',
            review: 'සමාලෝචනය යටතේ',
            verification: 'ලේඛන සත්‍යාපනය',
            approved: 'අනුමත කර ඇත',
        },
        buttons: {
            view: 'විස්තර බලන්න',
            refresh: 'නැවත تازه කරන්න',
        },
    },
    ta: {
        title: 'விண்ணப்ப நிலை',
        columns: {
            id: 'விண்ணப்ப ID',
            vehicleNo: 'வாகன எண்',
            type: 'வகை',
            status: 'நிலை',
            lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
            actions: 'செயல்கள்',
        },
        status: {
            submitted: 'சமர்ப்பிக்கப்பட்டது',
            review: 'மதிப்பாய்வில்',
            verification: 'ஆவண சரிபார்ப்பு',
            approved: 'அங்கீகரிக்கப்பட்டது',
        },
        buttons: {
            view: 'விவரங்களைக் காண்க',
            refresh: 'புதுப்பிக்க',
        },
    },
};

export const ApplicationStatus = () => {
    const { language, isDarkMode, setChatContext } = useStore();
    const { showToast } = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false); // New state for modal loading
    const [showDocumentViewer, setShowDocumentViewer] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentZoom, setDocumentZoom] = useState(100);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                showToast('error', 'User session expired. Please login again');
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/applications/user/${userEmail}`);
            setVehicles(response.data);
        } catch (error) {
            console.error('Error loading applications:', error);
            showToast('error', 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        loadVehicles();
    };

    const handleViewDetails = async (vehicleLite) => {
        setSelectedVehicle(vehicleLite); // Show data immediately
        setShowModal(true);
        setLoadingDetails(true);

        // Update Chat Context
        setChatContext({
            type: 'application',
            id: vehicleLite._id,
            reference: vehicleLite.paymentReference || 'Pending',
            title: `${vehicleLite.makeOfVehicle} ${vehicleLite.modelOfVehicle} (${vehicleLite.registrationNumber || 'Pending'})`,
            status: vehicleLite.status,
            details: vehicleLite // Pass full object for AI
        });

        try {
            // 1. Fetch Metadata (fast)
            const res = await axios.get(`http://localhost:5000/api/applications/${vehicleLite._id}`);
            setSelectedVehicle(res.data);

            // Update context again with full details
            setChatContext({
                type: 'application',
                id: res.data._id,
                reference: res.data.paymentReference || 'Pending',
                title: `${res.data.makeOfVehicle} ${res.data.modelOfVehicle} (${res.data.registrationNumber || 'Pending'})`,
                status: res.data.status,
                details: res.data
            });

            // 2. Fetch Resources Async
            axios.get(`http://localhost:5000/api/applications/${vehicleLite._id}/resources`)
                .then(resourceRes => {
                    setSelectedVehicle(prev => ({
                        ...prev,
                        documents: resourceRes.data.documents,
                        vehicleImage: resourceRes.data.vehicleImage
                    }));
                })
                .catch(err => console.error("Failed to load application resources", err));

        } catch (error) {
            console.error("Failed to fetch full application details", error);
            showToast('error', 'Failed to load full application details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedVehicle(null);
        setChatContext(null); // Clear context
    };

    const handleDeleteApplication = async () => {
        if (!selectedVehicle) return;

        if (selectedVehicle.status !== 'Pending') {
            showToast('error', 'Only pending applications can be deleted');
            return;
        }

        if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/applications/${selectedVehicle._id}`);
                showToast('success', 'Application deleted successfully');
                handleCloseModal();
                loadVehicles();
            } catch (error) {
                console.error('Error deleting application:', error);
                showToast('error', error.response?.data?.message || 'Failed to delete application');
            }
        }
    };

    const handleCancelApplication = async () => {
        if (!selectedVehicle) return;

        if (selectedVehicle.status !== 'Pending') {
            showToast('error', 'Only pending applications can be cancelled');
            return;
        }

        if (window.confirm('Are you sure you want to cancel this application?')) {
            try {
                await axios.put(`http://localhost:5000/api/applications/${selectedVehicle._id}/cancel`);
                showToast('success', 'Application cancelled successfully');
                handleCloseModal();
                loadVehicles();
            } catch (error) {
                console.error('Error cancelling application:', error);
                showToast('error', error.response?.data?.message || 'Failed to cancel application');
            }
        }
    };

    const handleEditApplication = async () => {
        if (!selectedVehicle) return;

        if (selectedVehicle.status !== 'Pending') {
            showToast('error', 'Only pending applications can be edited');
            return;
        }

        // Redirect to register vehicle page with pre-filled data
        localStorage.setItem('registerVehicleFormData', JSON.stringify({
            ownerName: selectedVehicle.ownerName,
            nationalIdNo: selectedVehicle.nationalIdNo,
            dateOfBirth: selectedVehicle.dateOfBirth,
            permanentAddress: selectedVehicle.permanentAddress,
            phoneNumber: selectedVehicle.phoneNumber,
            emailAddress: selectedVehicle.emailAddress,
            occupation: selectedVehicle.occupation,
            vehicleClass: selectedVehicle.vehicleClass,
            makeOfVehicle: selectedVehicle.makeOfVehicle,
            modelOfVehicle: selectedVehicle.modelOfVehicle,
            yearOfManufacture: selectedVehicle.yearOfManufacture.toString(),
            engineNumber: selectedVehicle.engineNumber,
            chassisNumber: selectedVehicle.chassisNumber,
            colorOfVehicle: selectedVehicle.colorOfVehicle,
            fuelType: selectedVehicle.fuelType,
            engineCapacity: selectedVehicle.engineCapacity,
            numberOfCylinders: selectedVehicle.numberOfCylinders.toString(),
            importedOrLocal: selectedVehicle.importedOrLocal,
            emissionStandard: selectedVehicle.emissionStandard,
            noOfOwners: selectedVehicle.noOfOwners.toString(),
            vipRequested: selectedVehicle.vipRequested,
            vipNumber: selectedVehicle.vipNumber,
        }));
        localStorage.setItem('userHasSeenLandingScreen', 'true');
        localStorage.setItem('editingApplicationId', selectedVehicle._id);

        window.location.href = '/register-vehicle';
    };

    const generatePDF = () => {
        if (!selectedVehicle) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;
        const margin = 20;
        const maxY = pageHeight - 20;

        const addNewPageIfNeeded = (requiredSpace) => {
            if (yPos + requiredSpace > maxY) {
                doc.addPage();
                yPos = 20;
            }
        };

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Vehicle Registration Application', pageWidth / 2, yPos, { align: 'center' });

        yPos += 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Application ID: ${selectedVehicle._id}`, margin, yPos);
        yPos += 7;
        doc.text(`Status: ${selectedVehicle.status}`, margin, yPos);
        yPos += 7;
        doc.text(`Submitted: ${new Date(selectedVehicle.createdAt).toLocaleString()}`, margin, yPos);

        // Owner Information
        addNewPageIfNeeded(80);
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Owner Information', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const ownerInfo = [
            `Full Name: ${selectedVehicle.ownerName}`,
            `NID: ${selectedVehicle.nationalIdNo}`,
            `DOB: ${selectedVehicle.dateOfBirth}`,
            `Phone: ${selectedVehicle.phoneNumber}`,
            `Email: ${selectedVehicle.emailAddress}`,
            `Occupation: ${selectedVehicle.occupation}`,
            `Address: ${selectedVehicle.permanentAddress}`,
        ];

        ownerInfo.forEach(info => {
            addNewPageIfNeeded(7);
            doc.text(info, margin, yPos);
            yPos += 7;
        });

        // Vehicle Information
        addNewPageIfNeeded(80);
        yPos += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Vehicle Information', margin, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const vehicleInfo = [
            `Registration Number: ${selectedVehicle.registrationNumber}`,
            `Vehicle Class: ${selectedVehicle.vehicleClass}`,
            `Make: ${selectedVehicle.makeOfVehicle}`,
            `Model: ${selectedVehicle.modelOfVehicle}`,
            `Year: ${selectedVehicle.yearOfManufacture}`,
            `Chassis Number: ${selectedVehicle.chassisNumber}`,
            `Engine Number: ${selectedVehicle.engineNumber}`,
            `Fuel Type: ${selectedVehicle.fuelType}`,
            `Engine Capacity: ${selectedVehicle.engineCapacity} cc`,
            `Number of Cylinders: ${selectedVehicle.numberOfCylinders}`,
            `Color: ${selectedVehicle.colorOfVehicle}`,
            `Imported/Local: ${selectedVehicle.importedOrLocal}`,
            `Emission Standard: ${selectedVehicle.emissionStandard}`,
            `Number of Owners: ${selectedVehicle.noOfOwners}`,
        ];

        vehicleInfo.forEach(info => {
            addNewPageIfNeeded(7);
            doc.text(info, margin, yPos);
            yPos += 7;
        });

        // Footer
        addNewPageIfNeeded(20);
        yPos += 20;
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('This is a system-generated document from DMT Digital Portal', pageWidth / 2, yPos, { align: 'center' });

        // Save PDF
        doc.save(`Vehicle_Application_${selectedVehicle.registrationNumber}.pdf`);
        showToast('success', 'PDF downloaded successfully');
    };

    const handleViewDocument = (docType, docData) => {
        setSelectedDocument({ type: docType, data: docData });
        setShowDocumentViewer(true);
        setDocumentZoom(100);
    };

    const handleCloseDocumentViewer = () => {
        setShowDocumentViewer(false);
        setSelectedDocument(null);
        setDocumentZoom(100);
    };

    const isImageFile = (data) => {
        return data && typeof data === 'string' && data.startsWith('data:image/');
    };

    const documentLabels = {
        nid: 'National ID Copy',
        invoice: 'Vehicle Invoice',
        insurance: 'Insurance Document',
        emission: 'Emission Certificate',
        approval: 'DMT Approval Letter',
    };

    const getStatusIcon = (status) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'under review':
            case 'review':
            case 'verification':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            case 'rejected':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

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
                            Track and manage your vehicle registration applications
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 disabled:opacity-50'
                            }`}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>{translations[language].buttons.refresh}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`rounded-2xl overflow-hidden ${isDarkMode
                ? 'bg-gray-800/50 border border-white/5'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading applications...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                            }`}>
                            <FileText className={`h-8 w-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No applications found</p>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Register a vehicle to see your applications here
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
                                {vehicles.map((vehicle) => (
                                    <tr
                                        key={vehicle._id}
                                        className={`transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className={`font-mono text-sm px-2 py-1 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                                                }`}>
                                                {vehicle._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {vehicle.vipRequested ? (
                                                <span className="inline-flex items-center gap-2">
                                                    {vehicle.vipNumber || vehicle.registrationNumber || 'Pending'}
                                                    <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">Special</span>
                                                </span>
                                            ) : (
                                                vehicle.registrationNumber || 'Pending'
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Registration</td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${vehicle.status.toLowerCase() === 'approved'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                                : vehicle.status.toLowerCase() === 'rejected'
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                                    : vehicle.status.toLowerCase() === 'submitted' || vehicle.status.toLowerCase() === 'pending'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                                }`}>
                                                {getStatusIcon(vehicle.status.toLowerCase())}
                                                <span>{vehicle.status}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {new Date(vehicle.updatedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(vehicle)}
                                                className={`p-2 rounded-lg transition-colors ${isDarkMode
                                                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                                                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Vehicle Details Modal */}
            {showModal && selectedVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        {/* Modal Header */}
                        <div className={`sticky top-0 flex items-center justify-between border-b p-6 ${isDarkMode ? 'border-white/10 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                            <div>
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Application Details</h2>
                                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    ID: <span className={`font-mono px-2 py-0.5 rounded ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>{selectedVehicle._id.slice(-6).toUpperCase()}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    {/* Status Badge */}
                                    <div className="mb-6 flex items-center gap-4">
                                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${selectedVehicle.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            selectedVehicle.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedVehicle.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {getStatusIcon(selectedVehicle.status.toLowerCase())}
                                            <span className="font-semibold">{selectedVehicle.status}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Submitted: {new Date(selectedVehicle.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Owner Information */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold">Owner Information</h3>
                                        <div className={`grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Full Name</p>
                                                <p className="font-medium">{selectedVehicle.ownerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">National ID</p>
                                                <p className="font-medium">{selectedVehicle.nationalIdNo}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{selectedVehicle.phoneNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{selectedVehicle.emailAddress}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-medium">{selectedVehicle.permanentAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Information */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold">Vehicle Information</h3>
                                        <div className={`grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Registration Number</p>
                                                <p className="font-medium">
                                                    {selectedVehicle.vipRequested ? (selectedVehicle.vipNumber || selectedVehicle.registrationNumber || 'Pending') : (selectedVehicle.registrationNumber || 'Pending')}
                                                    {selectedVehicle.vipRequested && (
                                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Special</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Vehicle Class</p>
                                                <p className="font-medium">{selectedVehicle.vehicleClass}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Make</p>
                                                <p className="font-medium">{selectedVehicle.makeOfVehicle}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Model</p>
                                                <p className="font-medium">{selectedVehicle.modelOfVehicle}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Year</p>
                                                <p className="font-medium">{selectedVehicle.yearOfManufacture}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Chassis Number</p>
                                                <p className="font-medium">{selectedVehicle.chassisNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Engine Number</p>
                                                <p className="font-medium">{selectedVehicle.engineNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Fuel Type</p>
                                                <p className="font-medium">{selectedVehicle.fuelType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Number of Owners</p>
                                                <p className="font-medium">{selectedVehicle.noOfOwners}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Color</p>
                                                <p className="font-medium">{selectedVehicle.colorOfVehicle}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold">Payment Details</h3>
                                        <div className={`grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Reference</p>
                                                <p className="font-mono text-xl font-bold tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
                                                    {selectedVehicle.paymentReference || '—'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Amount</p>
                                                <p className="font-medium">{typeof selectedVehicle.paymentAmount === 'number' ? `LKR ${selectedVehicle.paymentAmount.toFixed(2)}` : '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Status</p>
                                                <div className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold border ${selectedVehicle.paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                                                    }`}>
                                                    {selectedVehicle.paymentStatus === 'Paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    {selectedVehicle.paymentStatus || 'Pending'}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Special Number Requested</p>
                                                <p className="font-medium">{selectedVehicle.vipRequested ? 'Yes' : 'No'}</p>
                                            </div>
                                            {selectedVehicle.vipRequested && (
                                                <>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Special Number</p>
                                                        <p className="font-medium font-mono text-amber-600 dark:text-amber-400">{selectedVehicle.vipNumber || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Special Number Fee</p>
                                                        <p className="font-medium">{typeof selectedVehicle.vipFee === 'number' ? `LKR ${selectedVehicle.vipFee.toFixed(2)}` : '—'}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className={`mt-3 rounded-lg p-4 text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                                            Use the payment reference at your local post office to pay the fee. Keep the receipt for verification.
                                        </div>
                                    </div>

                                    {/* Admin Comments - Show if application has been reviewed */}
                                    {selectedVehicle.adminComments && (
                                        <div className="mb-6">
                                            <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
                                                <MessageSquare className="h-5 w-5" />
                                                {selectedVehicle.status === 'Rejected' ? 'Rejection Details' : 'Admin Review Comments'}
                                            </h3>
                                            <div className={`rounded-lg p-4 border-l-4 ${selectedVehicle.status === 'Rejected'
                                                ? 'bg-red-50 border-red-500 text-red-900'
                                                : selectedVehicle.status === 'Approved'
                                                    ? 'bg-green-50 border-green-500 text-green-900'
                                                    : 'bg-blue-50 border-blue-500 text-blue-900'
                                                }`}>
                                                {selectedVehicle.rejectionReason && (
                                                    <div className="mb-2">
                                                        <p className="text-sm font-semibold mb-1">Reason:</p>
                                                        <p className="font-medium">{selectedVehicle.rejectionReason}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    {selectedVehicle.rejectionReason && <p className="text-sm font-semibold mb-1">Details:</p>}
                                                    <p className="whitespace-pre-wrap">{selectedVehicle.adminComments}</p>
                                                </div>
                                                {selectedVehicle.reviewedBy && (
                                                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                                                        <p className="text-sm opacity-75">
                                                            Reviewed by: {selectedVehicle.reviewedBy} on {new Date(selectedVehicle.reviewedAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {selectedVehicle.status === 'Rejected' && (
                                                <div className={`mt-3 rounded-lg p-4 text-sm ${isDarkMode ? 'bg-yellow-900/20 text-yellow-200 border border-yellow-500/30' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
                                                    <p className="font-semibold mb-1">What to do next:</p>
                                                    <p>Please review the rejection reason and comments above. You may submit a new application after addressing the issues mentioned.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Documents */}
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold">Uploaded Documents</h3>
                                        <div className={`grid grid-cols-1 gap-3 rounded-lg p-4 md:grid-cols-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                            <button
                                                onClick={() => handleViewDocument('nidCopy', selectedVehicle.documents?.nidCopy)}
                                                className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>National ID Copy</span>
                                            </button>
                                            <button
                                                onClick={() => handleViewDocument('invoiceProof', selectedVehicle.documents?.invoiceProof)}
                                                className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>Invoice/Proof of Purchase</span>
                                            </button>
                                            <button
                                                onClick={() => handleViewDocument('insuranceDocument', selectedVehicle.documents?.insuranceDocument)}
                                                className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>Insurance Document</span>
                                            </button>
                                            <button
                                                onClick={() => handleViewDocument('emissionTest', selectedVehicle.documents?.emissionTest)}
                                                className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>Emission Test Certificate</span>
                                            </button>
                                            {selectedVehicle.documents?.inspectionReport && (
                                                <button
                                                    onClick={() => handleViewDocument('inspectionReport', selectedVehicle.documents?.inspectionReport)}
                                                    className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                                                >
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span>Inspection Report</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 justify-end">
                                        <button
                                            onClick={handleCloseModal}
                                            className={`rounded-lg px-6 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            Close
                                        </button>
                                        {selectedVehicle.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={handleEditApplication}
                                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={handleCancelApplication}
                                                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDeleteApplication}
                                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={generatePDF}
                                            className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                                        >
                                            <Download className="h-5 w-5" />
                                            Generate PDF
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Document Viewer Modal */}
            {showDocumentViewer && selectedDocument && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full h-full flex flex-col">
                        <div className="flex items-center justify-between p-4 bg-black/50 text-white">
                            <h3 className="text-xl font-semibold">
                                {documentLabels[selectedDocument.type] || 'Document Viewer'}
                            </h3>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setDocumentZoom(prev => Math.max(50, prev - 25))} className="p-2 hover:bg-white/10 rounded-lg">
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <span className="min-w-[3ch] text-sm">{documentZoom}%</span>
                                <button onClick={() => setDocumentZoom(prev => Math.min(200, prev + 25))} className="p-2 hover:bg-white/10 rounded-lg">
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button onClick={handleCloseDocumentViewer} className="p-2 hover:bg-white/10 rounded-lg text-red-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-8">
                            {isImageFile(selectedDocument.data) ? (
                                <img
                                    src={selectedDocument.data}
                                    alt="Document"
                                    style={{ transform: `scale(${documentZoom / 100})`, transition: 'transform 0.2s' }}
                                    className="max-w-full max-h-none shadow-2xl rounded-lg"
                                />
                            ) : (
                                <iframe
                                    src={selectedDocument.data}
                                    title="Document"
                                    className="w-full h-full bg-white rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
