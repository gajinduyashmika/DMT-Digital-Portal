import React from 'react';
import { useStore } from '../../store/useStore';
import { Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';

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
    },
  },
};

// Sample data
const applications = [
  {
    id: 'APP001',
    vehicleNo: 'ABC-1234',
    type: 'Registration',
    status: 'verification',
    lastUpdated: '2024-03-15 14:30',
    progress: 75,
  },
  {
    id: 'APP002',
    vehicleNo: 'XYZ-5678',
    type: 'Transfer',
    status: 'approved',
    lastUpdated: '2024-03-14 09:15',
    progress: 100,
  },
  {
    id: 'APP003',
    vehicleNo: 'DEF-9012',
    type: 'Registration',
    status: 'review',
    lastUpdated: '2024-03-13 16:45',
    progress: 50,
  },
];

export const ApplicationStatus = () => {
  const { language, isDarkMode } = useStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'verification':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h1 className="mb-6 text-2xl font-bold">{translations[language].title}</h1>

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
            {applications.map((application) => (
              <tr
                key={application.id}
                className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="px-4 py-2">{application.id}</td>
                <td className="px-4 py-2">{application.vehicleNo}</td>
                <td className="px-4 py-2">{application.type}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <span>
                      {translations[language].status[application.status as keyof typeof translations.en.status]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2">{application.lastUpdated}</td>
                <td className="px-4 py-2">
                  <button className="rounded p-1 hover:bg-gray-100">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress Bars */}
      <div className="mt-8 space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="space-y-2">
            <div className="flex justify-between">
              <span>
                {application.vehicleNo} - {application.type}
              </span>
              <span>{application.progress}%</span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-500"
                style={{ width: `${application.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};