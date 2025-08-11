import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, User, Calendar, Hash, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// Mock data for demonstration
const mockVehicles = {
  'CBM-6969': {
    regNumber: 'CBX-6969',
    ownerName: 'CHAMINDU GIMHAN',
    vehicleType: 'Car',
    mfdyear: '2019',
    model: 'Toyota Vitz',
    chassisNumber: 'CH123456789',
    engineNumber: 'EN987654321',
    registrationDate: '2023-12-15',
    lastUpdated: '2024-03-15',
    status: 'active',
  },
  'BIQ-9989': {
    regNumber: 'BIQ-9989',
    ownerName: 'SUPUN SANDEEP',
    vehicleType: 'Motorbike',
    mfdyear: '2020',
    model: 'Yamaha Fz-S',
    chassisNumber: 'CH987654321',
    engineNumber: 'EN123456789',
    registrationDate: '2023-08-20',
    lastUpdated: '2024-02-28',
    status: 'active',
  },
  'ABF-7887': {
    regNumber: 'ABF-7887',
    ownerName: 'CHAMINDA SILVA',
    vehicleType: 'Three Wheeler',
    mfdyear: '2018',
    model: 'Bajaj RE',
    chassisNumber: 'CH456789123',
    engineNumber: 'EN789123456',
    registrationDate: '2022-05-10',
    lastUpdated: '2024-01-20',
    status: 'active',
  },
};

export const VehicleInfo = () => {
  const { regNumber } = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (regNumber && mockVehicles[regNumber as keyof typeof mockVehicles]) {
        setVehicle(mockVehicles[regNumber as keyof typeof mockVehicles]);
        setError('');
      } else {
        setError(t('vehicle_not_found'));
      }
      setLoading(false);
    }, 1500);
  }, [regNumber, t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'transferred':
        return 'text-yellow-500';
      case 'blacklisted':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'transferred':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'blacklisted':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('vehicle_details')}</h1>
          <p className="mt-4 opacity-90">{t('vehicle_info_description')}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            vehicle && (
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">{vehicle.regNumber}</h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(vehicle.status)}
                    <span className={`font-semibold capitalize ${getStatusColor(vehicle.status)}`}>
                      {t(vehicle.status)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <User className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('owner_name')}</h3>
                        <p className="text-gray-600">{vehicle.ownerName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Car className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('vehicle_type_model')}</h3>
                        <p className="text-gray-600">
                          {vehicle.vehicleType} - {vehicle.model}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('vehicle_mfdy')}</h3>
                        <p className="text-gray-600">{vehicle.mfdyear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Hash className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('chassis_engine')}</h3>
                        <p className="text-gray-600">
                          {t('chassis')}: {vehicle.chassisNumber}
                          <br />
                          {t('engine')}: {vehicle.engineNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('registration_date')}</h3>
                        <p className="text-gray-600">
                          {new Date(vehicle.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-red-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{t('last_updated')}</h3>
                        <p className="text-gray-600">
                          {new Date(vehicle.lastUpdated).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
};