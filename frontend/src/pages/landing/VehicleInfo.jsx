import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, User, Calendar, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Loader2, Shield, FileText, Clock } from 'lucide-react';


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
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [vehicle, setVehicle] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const { requesterNIC, requesterPhone } = location.state || {};

        if (!requesterNIC || !requesterPhone) {
            // Redirect back to search if credentials are missing
            navigate('/check-details');
            return;
        }

        const fetchVehicle = async () => {
            try {
                const response = await axios.post(`http://localhost:5000/api/vehicles/public-search`, {
                    regNumber,
                    requesterNIC,
                    requesterPhone
                });
                setVehicle(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching vehicle:', err);
                setError(t('vehicle_not_found'));
                setVehicle(null);
            } finally {
                setLoading(false);
            }
        };

        if (regNumber) {
            fetchVehicle();
        }
    }, [regNumber, t, location.state, navigate]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'active':
                return {
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10 border-green-500/20',
                    icon: CheckCircle,
                    gradient: 'from-green-500 to-emerald-500'
                };
            case 'transferred':
                return {
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
                    icon: AlertTriangle,
                    gradient: 'from-yellow-500 to-orange-500'
                };
            case 'blacklisted':
                return {
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10 border-red-500/20',
                    icon: XCircle,
                    gradient: 'from-red-500 to-rose-500'
                };
            default:
                return {
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-500/10 border-gray-500/20',
                    icon: Shield,
                    gradient: 'from-gray-500 to-gray-600'
                };
        }
    };

    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                ></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-8 pb-8">
                <div className="container mx-auto px-4">
                    <Link
                        to="/check-details"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {t('vehicle_details')}
                    </h1>
                    <p className="text-gray-400 text-lg">{t('vehicle_info_description')}</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative z-10 py-8 pb-20">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-20 animate-ping absolute"></div>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                </div>
                            </div>
                            <p className="mt-6 text-gray-400 text-lg">{t('loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 p-8 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Vehicle Not Found</h3>
                                <p className="text-gray-400 mb-6">{error}</p>
                                <Link
                                    to="/check-details"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Search Again
                                </Link>
                            </div>
                        </div>
                    ) : (
                        vehicle && (
                            <div className="max-w-4xl mx-auto space-y-6">
                                {/* Header Card with Status */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                                <Car className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-white tracking-wider">{vehicle.regNumber}</h2>
                                                <p className="text-gray-400">{vehicle.makeModel || `${vehicle.makeOfVehicle || ''} ${vehicle.modelOfVehicle || ''}` || 'Unknown Model'} - {vehicle.vehicleType}</p>
                                            </div>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusConfig(vehicle.status).bgColor}`}>
                                            {(() => {
                                                const StatusIcon = getStatusConfig(vehicle.status).icon;
                                                return <StatusIcon className={`w-5 h-5 ${getStatusConfig(vehicle.status).color}`} />;
                                            })()}
                                            <span className={`font-semibold capitalize ${getStatusConfig(vehicle.status).color}`}>
                                                {t(vehicle.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Image */}
                                {vehicle.vehicleImage && (
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 overflow-hidden">
                                        <div className="aspect-[16/9] w-full max-h-[400px] rounded-xl overflow-hidden relative group">
                                            <img
                                                src={vehicle.vehicleImage}
                                                alt={`${vehicle.regNumber} - ${vehicle.makeModel}`}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                <p className="text-white font-medium text-lg">
                                                    {vehicle.makeModel || 'Vehicle Image'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Details Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Owner Information */}
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-white font-semibold">{t('owner_name')}</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg">{vehicle.fullName || vehicle.ownerName}</p>
                                    </div>

                                    {/* Vehicle Type & Model */}
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                <Car className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-white font-semibold">{t('vehicle_type_model')}</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg">{vehicle.makeModel || `${vehicle.makeOfVehicle || ''} ${vehicle.modelOfVehicle || ''}` || '-'}</p>
                                    </div>

                                    {/* Manufacturing Year */}
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-white font-semibold">{t('vehicle_mfdy')}</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg">{vehicle.year || vehicle.yearOfManufacture || '-'}</p>
                                    </div>

                                    {/* Removed Chassis/Engine display for privacy */}

                                    {/* Registration Date */}
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-white font-semibold">{t('registration_date')}</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg">{vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : '-'}</p>
                                    </div>

                                    {/* Last Updated */}
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-white font-semibold">{t('last_updated')}</h3>
                                        </div>
                                        <p className="text-gray-300 text-lg">{vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString() : '-'}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link
                                        to="/check-details"
                                        className="flex-1 py-4 px-6 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Search Another Vehicle
                                    </Link>
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Print Details
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>
        </main >
    );
};
