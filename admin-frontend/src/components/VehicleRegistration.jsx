import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
    Search,
    Filter,
    Eye,
    Check,
    X,
    FileText,
    Car,
    Calendar,
    User,
    AlertCircle,
    Download,
    MessageSquare,
    ClipboardCheck,
    AlertTriangle
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

import { CRVDocument } from './CRVDocument';
import { DocumentViewer } from './DocumentViewer';
import { generatePDF } from '../utils/pdfGenerator';
import { useRef } from 'react';

export default function VehicleRegistration() {
    const { token, user } = useAuth();

    // Original Hooks moved here
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Modal states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Document Viewer state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerUrl, setViewerUrl] = useState('');
    const [viewerTitle, setViewerTitle] = useState('');

    const [registrationNumber, setRegistrationNumber] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [adminComments, setAdminComments] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Review Mode State
    const [reviewMode, setReviewMode] = useState(false);
    const [fieldReviews, setFieldReviews] = useState({
        ownerDetails: { status: 'Pending', comment: '' },
        vehicleDetails: { status: 'Pending', comment: '' },
        documents: { status: 'Pending', comment: '' },
        payment: { status: 'Pending', comment: '' },
    });

    const crvRef = useRef(null);
    // ... existing ...

    const handleViewCRV = async () => {
        setGeneratingPdf(true);
        // We will generate the PDF and then open it in the document viewer
        // Since generatePDF saves it, we might want to adapt generatePDF to return blob or just let it save and maybe show preview.
        // For admin, downloading is fine.
        // To view it in DocumentViewer, we need a URL. `generatePDF` uses `pdf.save()`.
        // We can modify `generatePDF` to return data URL or just download.
        // Let's just trigger download for now as it's easier and consistent with user flow.
        await generatePDF(crvRef, `CRV_${selectedApplication.registrationNumber || selectedApplication._id}.pdf`);
        setGeneratingPdf(false);
    };

    // ... openDocument ...




    useEffect(() => {
        fetchApplications();
    }, [token, statusFilter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/applications`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: statusFilter !== 'all' ? statusFilter : undefined }
            });
            setApplications(response.data.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedApplication) return;

        try {
            setActionLoading(true);
            await axios.put(`${API_URL}/admin/applications/${selectedApplication._id}/approve`, {
                registrationNumber: registrationNumber || selectedApplication.vipNumber,
                adminComments,
                adminNotes,
                bypassReview: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Application approved successfully!');
            setShowApproveModal(false);
            setSelectedApplication(null);
            setRegistrationNumber('');
            setAdminComments('');
            setAdminNotes('');
            fetchApplications();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve application');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedApplication || !rejectionReason) return;

        try {
            setActionLoading(true);
            await axios.put(`${API_URL}/admin/applications/${selectedApplication._id}/reject`, {
                reason: rejectionReason,
                adminComments,
                adminNotes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Application rejected');
            setShowRejectModal(false);
            setSelectedApplication(null);
            setRejectionReason('');
            setAdminComments('');
            setAdminNotes('');
            fetchApplications();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject application');
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewDetails = async (appLite) => {
        // Show modal immediately with lighter data or loading state
        setSelectedApplication(appLite);
        setShowDetailModal(true);
        setActionLoading(true);

        try {
            // 1. Fetch Metadata (fast)
            const metaResponse = await axios.get(`${API_URL}/admin/applications/${appLite._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fullAppMetadata = metaResponse.data;

            // Update state with metadata first (so text fields render)
            setSelectedApplication(fullAppMetadata);
            setFieldReviews(fullAppMetadata.fieldReviews || {
                ownerDetails: { status: 'Pending', comment: '' },
                vehicleDetails: { status: 'Pending', comment: '' },
                documents: { status: 'Pending', comment: '' },
                payment: { status: 'Pending', comment: '' },
            });

            // 2. Fetch Resources (images/docs) - Async
            axios.get(`${API_URL}/admin/applications/${appLite._id}/resources`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                // Merge resources into the existing application state
                setSelectedApplication(prev => ({
                    ...prev,
                    documents: res.data.documents,
                    vehicleImage: res.data.vehicleImage
                }));
            }).catch(err => {
                console.error("Failed to load application resources", err);
            });

        } catch (error) {
            console.error("Failed to fetch full application details", error);
            alert("Failed to load full application details. Please try again.");
            setShowDetailModal(false); // Close if failed
        } finally {
            setActionLoading(false); // Stop main loading spinner
            setReviewMode(false);
        }
    };

    const handleSaveReview = async () => {
        if (!selectedApplication) return;
        try {
            setActionLoading(true);
            const progress = Object.values(fieldReviews).filter(r => r.status !== 'Pending').length * 25;

            await axios.put(`${API_URL}/admin/applications/${selectedApplication._id}/review`, {
                fieldReviews,
                reviewProgress: progress,
                status: 'Under Review' // Auto-move to Under Review
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setApplications(prev => prev.map(app =>
                app._id === selectedApplication._id
                    ? { ...app, fieldReviews, reviewProgress: progress, status: app.status === 'Pending' ? 'Under Review' : app.status }
                    : app
            ));

            // alert('Review progress saved');
        } catch (error) {
            console.error(error);
            alert('Failed to save review');
        } finally {
            setActionLoading(false);
        }
    };

    const isReviewComplete = () => {
        if (!reviewMode) return false; // Must be in review mode or have completed review? 
        // Logic: All sections must be 'Correct'
        const sections = ['ownerDetails', 'vehicleDetails', 'documents', 'payment'];
        return sections.every(section => fieldReviews[section]?.status === 'Correct');
    };

    const ReviewControls = ({ section }) => {
        if (!reviewMode) return null;

        const review = fieldReviews[section] || { status: 'Pending', comment: '' };

        return (
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Verification:</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFieldReviews(prev => ({
                                ...prev,
                                [section]: { ...prev[section], status: 'Correct' }
                            }))}
                            className={`p-1.5 rounded-full transition-colors ${review.status === 'Correct' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'}`}
                            title="Mark as Correct"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setFieldReviews(prev => ({
                                ...prev,
                                [section]: { ...prev[section], status: 'Incorrect' }
                            }))}
                            className={`p-1.5 rounded-full transition-colors ${review.status === 'Incorrect' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'}`}
                            title="Mark as Incorrect"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {review.status === 'Incorrect' && (
                    <input
                        type="text"
                        placeholder="Describe the error..."
                        value={review.comment}
                        onChange={(e) => setFieldReviews(prev => ({
                            ...prev,
                            [section]: { ...prev[section], comment: e.target.value }
                        }))}
                        className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                )}
                {review.status === 'Correct' && (
                    <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                        <Check className="w-3 h-3 mr-1" /> Verified
                    </p>
                )}
            </div>
        );
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'under review': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        const statusLower = status?.toLowerCase();
        switch (statusLower) {
            case 'approved': return <Check className="h-4 w-4" />;
            case 'rejected': return <X className="h-4 w-4" />;
            case 'under review': return <AlertCircle className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.chassisNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.makeOfVehicle?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const openDocument = (url, title) => {
        setViewerUrl(url);
        setViewerTitle(title);
        setViewerOpen(true);
    };

    return (
        <div className="space-y-6">
            <DocumentViewer
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
                documentUrl={viewerUrl}
                title={viewerTitle}
            />

            {/* Hidden CRV Document */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                {selectedApplication && selectedApplication.status === 'Approved' && (
                    <CRVDocument ref={crvRef} vehicle={selectedApplication} />
                )}
            </div>


            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Registration Applications</h1>
                <button
                    onClick={fetchApplications}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email, chassis number, or make..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Under Review">Under Review</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Application ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{app._id.slice(-8).toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Car className="h-5 w-5 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {app.makeOfVehicle} {app.modelOfVehicle} ({app.yearOfManufacture})
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {app.vehicleClass} • {app.registrationNumber || app.vipNumber || 'Pending'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{app.ownerEmail}</div>
                                            <div className="text-sm text-gray-500">{app.ownerName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                <span className="ml-1 capitalize">{app.status?.replace('_', ' ')}</span>
                                            </span>
                                            {app.vipRequested && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    Special
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-900">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(app)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {['Pending', 'Under Review', 'correction_needed'].includes(app.status) && (
                                                    <>
                                                        <button
                                                            onClick={() => { setSelectedApplication(app); setShowApproveModal(true); }}
                                                            className="text-green-600 hover:text-green-900 p-1 rounded"
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedApplication(app); setShowRejectModal(true); }}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Details Modal */}
            {showDetailModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Application Details
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    ID: {selectedApplication._id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowDetailModal(false); setSelectedApplication(null); }}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="overflow-y-auto flex-1 p-6">
                            {actionLoading && !selectedApplication.documents ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        {/* Owner Information */}
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                                <User className="h-4 w-4 mr-2" />
                                                Owner Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="font-medium text-gray-700">Full Name:</span> {selectedApplication.ownerName}</p>
                                                <p><span className="font-medium text-gray-700">Email:</span> {selectedApplication.ownerEmail}</p>
                                                <p><span className="font-medium text-gray-700">National ID:</span> {selectedApplication.nationalIdNo}</p>
                                                <p><span className="font-medium text-gray-700">Date of Birth:</span> {new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>
                                                <p><span className="font-medium text-gray-700">Phone:</span> {selectedApplication.phoneNumber}</p>
                                                <p><span className="font-medium text-gray-700">Occupation:</span> {selectedApplication.occupation || 'N/A'}</p>
                                                <p><span className="font-medium text-gray-700">Address:</span> {selectedApplication.permanentAddress}</p>
                                            </div>
                                            <ReviewControls section="ownerDetails" />
                                        </div>

                                        {/* Vehicle Information */}
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                                <Car className="h-4 w-4 mr-2" />
                                                Vehicle Information
                                            </h4>
                                            {selectedApplication.vehicleImage && (
                                                <div className="mb-4">
                                                    <img
                                                        src={selectedApplication.vehicleImage}
                                                        alt="Vehicle"
                                                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2 text-sm">
                                                <p><span className="font-medium text-gray-700">Class:</span> {selectedApplication.vehicleClass}</p>
                                                <p><span className="font-medium text-gray-700">Make:</span> {selectedApplication.makeOfVehicle}</p>
                                                <p><span className="font-medium text-gray-700">Model:</span> {selectedApplication.modelOfVehicle}</p>
                                                <p><span className="font-medium text-gray-700">Year:</span> {selectedApplication.yearOfManufacture}</p>
                                                <p><span className="font-medium text-gray-700">Color:</span> {selectedApplication.colorOfVehicle}</p>
                                                <p><span className="font-medium text-gray-700">Fuel Type:</span> {selectedApplication.fuelType}</p>
                                                <p><span className="font-medium text-gray-700">Engine Capacity:</span> {selectedApplication.engineCapacity || 'N/A'}</p>
                                                <p><span className="font-medium text-gray-700">Cylinders:</span> {selectedApplication.numberOfCylinders || 'N/A'}</p>
                                                <p><span className="font-medium text-gray-700">Engine Number:</span> {selectedApplication.engineNumber}</p>
                                                <p><span className="font-medium text-gray-700">Chassis Number:</span> {selectedApplication.chassisNumber}</p>
                                                <p><span className="font-medium text-gray-700">Origin:</span> {selectedApplication.importedOrLocal}</p>
                                                <p><span className="font-medium text-gray-700">Emission Standard:</span> {selectedApplication.emissionStandard || 'N/A'}</p>
                                                <p><span className="font-medium text-gray-700">Number of Owners:</span> {selectedApplication.noOfOwners}</p>
                                            </div>
                                            <ReviewControls section="vehicleDetails" />
                                        </div>

                                        {/* Payment Information */}
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="font-medium text-gray-700">Reference:</span> <span className="font-mono font-bold text-blue-600">{selectedApplication.paymentReference}</span></p>
                                                <p><span className="font-medium text-gray-700">Amount:</span> LKR {selectedApplication.paymentAmount?.toLocaleString()}</p>
                                                <p className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-700">Status:</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedApplication.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {selectedApplication.paymentStatus || 'Pending'}
                                                    </span>
                                                </p>
                                                {selectedApplication.vipRequested && (
                                                    <>
                                                        <p><span className="font-medium text-gray-700">Special Number:</span> {selectedApplication.vipNumber}</p>
                                                        <p><span className="font-medium text-gray-700">Special Fee:</span> LKR {selectedApplication.vipFee?.toLocaleString()}</p>
                                                    </>
                                                )}
                                            </div>
                                            <ReviewControls section="payment" />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        {/* Documents */}
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Submitted Documents
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedApplication.documents?.nidCopy && (
                                                    <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                                        <span className="text-sm">National ID Copy</span>
                                                        <button
                                                            onClick={() => openDocument(selectedApplication.documents.nidCopy, 'National ID')}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                )}
                                                {selectedApplication.documents?.invoiceProof && (
                                                    <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                                        <span className="text-sm">Invoice/Proof of Purchase</span>
                                                        <button
                                                            onClick={() => openDocument(selectedApplication.documents.invoiceProof, 'Invoice Proof')}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                )}
                                                {selectedApplication.documents?.insuranceDocument && (
                                                    <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                                        <span className="text-sm">Insurance Document</span>
                                                        <button
                                                            onClick={() => openDocument(selectedApplication.documents.insuranceDocument, 'Insurance Document')}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                )}
                                                {selectedApplication.documents?.emissionTest && (
                                                    <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                                        <span className="text-sm">Emission Test Certificate</span>
                                                        <button
                                                            onClick={() => openDocument(selectedApplication.documents.emissionTest, 'Emission Test')}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                )}
                                                {selectedApplication.documents?.inspectionReport && (
                                                    <div className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
                                                        <span className="text-sm">Inspection Report</span>
                                                        <button
                                                            onClick={() => openDocument(selectedApplication.documents.inspectionReport, 'Inspection Report')}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <ReviewControls section="documents" />
                                        </div>

                                        {/* Status & Review Info */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Application Status</h4>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="font-medium text-gray-700">Status:</span>
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                                                        {selectedApplication.status}
                                                    </span>
                                                </p>
                                                <p><span className="font-medium text-gray-700">Submitted:</span> {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                                                {selectedApplication.reviewedBy && (
                                                    <>
                                                        <p><span className="font-medium text-gray-700">Reviewed By:</span> {selectedApplication.reviewedBy}</p>
                                                        <p><span className="font-medium text-gray-700">Reviewed At:</span> {new Date(selectedApplication.reviewedAt).toLocaleString()}</p>
                                                    </>
                                                )}
                                                {selectedApplication.registrationNumber && (
                                                    <p><span className="font-medium text-gray-700">Registration Number:</span> {selectedApplication.registrationNumber}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* CRV Generation section */}
                                        {selectedApplication.status === 'Approved' && (
                                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                                    <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                                                    Digital CRV
                                                </h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Certificate of Registration</span>
                                                    <button
                                                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                                        onClick={handleViewCRV}
                                                        disabled={generatingPdf}
                                                    >
                                                        {generatingPdf ? (
                                                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                        ) : (
                                                            <Eye className="w-3 h-3" />
                                                        )}
                                                        View / Download CRV
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Comments (visible to client) */}
                                        {selectedApplication.adminComments && (
                                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Admin Comments (Visible to Client)
                                                </h4>
                                                <p className="text-sm text-gray-700">{selectedApplication.adminComments}</p>
                                            </div>
                                        )}

                                        {/* Admin Internal Notes */}
                                        {selectedApplication.adminNotes && (
                                            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                                <h4 className="text-sm font-bold text-gray-900 mb-2">Internal Notes (Admin Only)</h4>
                                                <p className="text-sm text-gray-700">{selectedApplication.adminNotes}</p>
                                            </div>
                                        )}

                                        {/* Rejection Reason */}
                                        {selectedApplication.rejectionReason && (
                                            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                                <h4 className="text-sm font-bold text-gray-900 mb-2">Rejection Reason</h4>
                                                <p className="text-sm text-gray-700">{selectedApplication.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer - Actions */}
                        {['Pending', 'Under Review', 'correction_needed'].includes(selectedApplication.status) && (
                            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setReviewMode(!reviewMode)}
                                        className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${reviewMode
                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <ClipboardCheck className="h-4 w-4" />
                                        {reviewMode ? 'Exit Review Mode' : 'Start Review'}
                                    </button>

                                    {reviewMode && (
                                        <button
                                            onClick={handleSaveReview}
                                            disabled={actionLoading}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                                        >
                                            {actionLoading ? 'Saving...' : 'Save Progress'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => { setShowDetailModal(false); setShowApproveModal(true); }}
                                        disabled={!isReviewComplete() || selectedApplication.paymentStatus !== 'Paid'}
                                        className={`px-6 py-2 rounded-md flex items-center transition-colors ${isReviewComplete() && selectedApplication.paymentStatus === 'Paid'
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        title={
                                            selectedApplication.paymentStatus !== 'Paid'
                                                ? "Payment must be verified to approve"
                                                : !isReviewComplete()
                                                    ? "Complete all reviews to approve"
                                                    : "Approve Application"
                                        }
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve Application
                                    </button>
                                    <button
                                        onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }}
                                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && selectedApplication && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Approve Application</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Number *
                                </label>
                                <input
                                    type="text"
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    placeholder={selectedApplication.vipNumber || 'Enter registration number'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {selectedApplication.vipNumber ? `Special Number requested: ${selectedApplication.vipNumber}` : 'Assign a registration number'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Comments for Client
                                </label>
                                <textarea
                                    value={adminComments}
                                    onChange={(e) => setAdminComments(e.target.value)}
                                    placeholder="Optional message visible to client..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be visible to the client</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Internal Notes (Admin Only)
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Internal notes (not visible to client)..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                    rows={2}
                                />
                                <p className="text-xs text-gray-500 mt-1">For internal reference only</p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setShowDetailModal(true);
                                        setRegistrationNumber('');
                                        setAdminComments('');
                                        setAdminNotes('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={actionLoading || !registrationNumber}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? 'Processing...' : 'Approve Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedApplication && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Application</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rejection Reason *
                                </label>
                                <select
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select reason</option>
                                    <option value="Invalid or unclear documents">Invalid or unclear documents</option>
                                    <option value="Incomplete information">Incomplete information</option>
                                    <option value="Document mismatch">Document mismatch</option>
                                    <option value="Verification failed">Verification failed</option>
                                    <option value="Vehicle does not meet standards">Vehicle does not meet standards</option>
                                    <option value="Fraudulent application">Fraudulent application</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Detailed Comments for Client *
                                </label>
                                <textarea
                                    value={adminComments}
                                    onChange={(e) => setAdminComments(e.target.value)}
                                    placeholder="Explain to the client why the application was rejected..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                    rows={4}
                                />
                                <p className="text-xs text-gray-500 mt-1">Be specific so the client understands what went wrong</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Internal Notes (Admin Only)
                                </label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Internal notes (not visible to client)..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                    rows={2}
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setShowDetailModal(true);
                                        setRejectionReason('');
                                        setAdminComments('');
                                        setAdminNotes('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={actionLoading || !rejectionReason || !adminComments}
                                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? 'Processing...' : 'Reject Application'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
