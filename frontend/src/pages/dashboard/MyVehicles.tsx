import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Eye, Download, X } from 'lucide-react';

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
    },
    modal: {
      title: 'Vehicle Details',
      close: 'Close',
    },
  },
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
    },
    modal: {
      title: 'வாகன விவரங்கள்',
      close: 'மூடு',
    },
  },
};

// Sample data
const vehicles = [
  {
    id: 1,
    regNo: 'ABC-1234',
    type: 'Car',
    makeModel: 'Toyota Corolla',
    status: 'Active',
    details: {
      owner: 'John Doe',
      chassisNo: 'CH123456789',
      engineNo: 'EN987654321',
      yearMade: '2020',
      fuelType: 'Petrol',
      lastInspection: '2023-12-01',
    },
  },
  {
    id: 2,
    regNo: 'XYZ-5678',
    type: 'Van',
    makeModel: 'Honda CR-V',
    status: 'Transfer Pending',
    details: {
      owner: 'John Doe',
      chassisNo: 'CH987654321',
      engineNo: 'EN123456789',
      yearMade: '2019',
      fuelType: 'Diesel',
      lastInspection: '2023-11-15',
    },
  },
];

export const MyVehicles = () => {
  const { language, isDarkMode } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h1 className="mb-6 text-2xl font-bold">{translations[language].title}</h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder={translations[language].search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-lg border pl-10 pr-4 py-2 ${
            isDarkMode
              ? 'border-gray-600 bg-gray-700'
              : 'border-gray-300 bg-white'
          }`}
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Vehicles Table */}
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
            {filteredVehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="px-4 py-2">{vehicle.regNo}</td>
                <td className="px-4 py-2">{vehicle.type}</td>
                <td className="px-4 py-2">{vehicle.makeModel}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs ${
                      vehicle.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="rounded p-1 hover:bg-gray-100">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`w-full max-w-lg rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {translations[language].modal.title}
              </h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {Object.entries(selectedVehicle.details).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};