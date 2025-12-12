import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Eye, AlertCircle, CheckCircle, Clock, X, Download, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
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

interface Vehicle {
  _id: string;
  ownerEmail: string;
  ownerName: string;
  nationalIdNo: string;
  dateOfBirth: string;
  permanentAddress: string;
  phoneNumber: string;
  emailAddress: string;
  occupation: string;
  registrationNumber: string;
  vehicleClass: string;
  makeOfVehicle: string;
  modelOfVehicle: string;
  yearOfManufacture: number;
  engineNumber: string;
  chassisNumber: string;
  colorOfVehicle: string;
  fuelType: string;
  engineCapacity: string;
  numberOfCylinders: number;
  importedOrLocal: string;
  emissionStandard: string;
  noOfOwners: number;
  documents: {
    nidCopy: string;
    invoiceProof: string;
    insuranceDocument: string;
    emissionTest: string;
    inspectionReport: string | null;
  };
  status: string;
  adminNotes: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ApplicationStatus = () => {
  const { language, isDarkMode } = useStore();
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; data: string } | null>(null);
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
    } catch (error: any) {
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

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const generatePDF = () => {
    if (!selectedVehicle) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    const margin = 20;
    const maxY = pageHeight - 20;

    const addNewPageIfNeeded = (requiredSpace: number) => {
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

  const handleViewDocument = (docType: string, docData: string) => {
    setSelectedDocument({ type: docType, data: docData });
    setShowDocumentViewer(true);
    setDocumentZoom(100);
  };

  const handleCloseDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedDocument(null);
    setDocumentZoom(100);
  };

  const isImageFile = (data: string): boolean => {
    return data.startsWith('data:image/');
  };

  const documentLabels: Record<string, string> = {
    nid: 'National ID Copy',
    invoice: 'Vehicle Invoice',
    insurance: 'Insurance Document',
    emission: 'Emission Certificate',
    approval: 'DMT Approval Letter',
  };

  const getStatusIcon = (status: string) => {
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
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{translations[language].title}</h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-700/70' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{translations[language].buttons.refresh}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {Object.values(translations[language].columns).map((column) => (
                  <th key={column} className="px-4 py-2 text-left">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle._id}
                  className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <td className="px-4 py-2">{vehicle._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-2">{vehicle.registrationNumber}</td>
                  <td className="px-4 py-2">Registration</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(vehicle.status.toLowerCase())}
                      <span>{vehicle.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{new Date(vehicle.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => handleViewDetails(vehicle)}
                      className={`rounded p-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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

      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 flex items-center justify-between border-b p-6 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div>
                <h2 className="text-2xl font-bold">Application Details</h2>
                <p className="mt-1 text-sm text-gray-500">
                  ID: {selectedVehicle._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className={`rounded-lg p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6 flex items-center gap-4">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                  selectedVehicle.status === 'Approved' ? 'bg-green-100 text-green-800' :
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
                    <p className="font-medium">{selectedVehicle.registrationNumber}</p>
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

              {/* Documents */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">Uploaded Documents</h3>
                <div className={`grid grid-cols-1 gap-3 rounded-lg p-4 md:grid-cols-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <button
                    onClick={() => handleViewDocument('nidCopy', selectedVehicle.documents.nidCopy)}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>National ID Copy</span>
                  </button>
                  <button
                    onClick={() => handleViewDocument('invoiceProof', selectedVehicle.documents.invoiceProof)}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Invoice/Proof of Purchase</span>
                  </button>
                  <button
                    onClick={() => handleViewDocument('insuranceDocument', selectedVehicle.documents.insuranceDocument)}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Insurance Document</span>
                  </button>
                  <button
                    onClick={() => handleViewDocument('emissionTest', selectedVehicle.documents.emissionTest)}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Emission Test Certificate</span>
                  </button>
                  {selectedVehicle.documents.inspectionReport && (
                    <button
                      onClick={() => handleViewDocument('inspectionReport', selectedVehicle.documents.inspectionReport!)}
                      className={`flex items-center gap-2 rounded px-3 py-2 text-left transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Inspection Report</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className={`rounded-lg px-6 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Close
                </button>
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                >
                  <Download className="h-5 w-5" />
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className={`max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Document Header */}
            <div className={`flex items-center justify-between border-b p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div>
                <h2 className="text-xl font-bold">
                  {documentLabels[selectedDocument.type] || selectedDocument.type}
                </h2>
              </div>
              <button
                onClick={handleCloseDocumentViewer}
                className={`rounded-lg p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Document Content */}
            <div className="flex max-h-[calc(90vh-120px)] overflow-auto">
              {isImageFile(selectedDocument.data) ? (
                <div className="w-full overflow-auto bg-black p-4">
                  <img
                    src={selectedDocument.data}
                    alt={documentLabels[selectedDocument.type] || selectedDocument.type}
                    style={{ width: `${documentZoom}%`, margin: '0 auto', display: 'block', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div className="w-full bg-gray-100 p-8 text-center">
                  <FileText className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-600">PDF Document</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Click the download button to view or download the PDF
                  </p>
                </div>
              )}
            </div>

            {/* Document Footer */}
            <div className={`flex items-center justify-between border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2">
                {isImageFile(selectedDocument.data) && (
                  <>
                    <button
                      onClick={() => setDocumentZoom(Math.max(50, documentZoom - 10))}
                      className={`rounded px-3 py-1 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-sm">{documentZoom}%</span>
                    <button
                      onClick={() => setDocumentZoom(Math.min(200, documentZoom + 10))}
                      className={`rounded px-3 py-1 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={handleCloseDocumentViewer}
                className={`rounded-lg px-6 py-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};