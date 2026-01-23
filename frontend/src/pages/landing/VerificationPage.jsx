import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const VerificationPage = () => {
    const { regNumber } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode } = useStore();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                // Use window.location.hostname to dynamically connect to the backend on the same network
                const baseUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
                const response = await axios.get(`${baseUrl}/api/vehicles/verify/${regNumber}`);
                setVehicle(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Verification failed', err);
                setError('Vehicle not found or verification failed');
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [regNumber]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Verifying Digital Certificate...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4">

            {/* Header / Brand */}
            <div className="w-full max-w-md flex justify-between items-center mb-8 mt-4">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Home
                </Link>
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">DMT Verification</span>
                </div>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </div>

            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                {/* Status Header */}
                <div className={`p-8 flex flex-col items-center justify-center text-center ${vehicle?.isValid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    {vehicle?.isValid ? (
                        <>
                            <div className="h-20 w-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">Verified Vehicle</h1>
                            <p className="text-sm text-green-600 dark:text-green-300 mt-2">Official DMT Digital Record</p>
                        </>
                    ) : (
                        <>
                            <div className="h-20 w-20 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mb-4">
                                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400">Verification Failed</h1>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-2">{error || 'This QR Code is not valid.'}</p>
                        </>
                    )}
                </div>

                {/* Vehicle Details Card */}
                {vehicle && (
                    <div className="p-6 space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Registration Number</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 font-mono tracking-tighter">
                                {vehicle.regNumber}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3">
                                <span className="block text-gray-500 text-xs">Make & Model</span>
                                <span className="block font-medium dark:text-gray-200">{vehicle.makeModel}</span>
                            </div>
                            <div className="p-3">
                                <span className="block text-gray-500 text-xs">Vehicle Type</span>
                                <span className="block font-medium dark:text-gray-200">{vehicle.vehicleType}</span>
                            </div>
                            <div className="p-3">
                                <span className="block text-gray-500 text-xs">Year</span>
                                <span className="block font-medium dark:text-gray-200">{vehicle.year}</span>
                            </div>
                            <div className="p-3">
                                <span className="block text-gray-500 text-xs">Fuel Type</span>
                                <span className="block font-medium dark:text-gray-200">{vehicle.fuelType}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                                Last verified: {new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-xs text-center text-gray-400 max-w-xs">
                This is an official digital record provided by the Department of Motor Traffic.
                Scan to verify anytime.
            </p>
        </div>
    );
};
