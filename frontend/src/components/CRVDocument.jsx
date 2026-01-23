import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Car, Bike, Truck, Tractor, Bus } from 'lucide-react';
import logo from '../assets/corner_logo.png';

export const CRVDocument = forwardRef(({ vehicle }, ref) => {
    if (!vehicle) return null;

    const getVehicleIcon = (type) => {
        const t = type?.toLowerCase();
        if (t?.includes('bike') || t?.includes('cycle') || t?.includes('motorcycle')) return <Bike size={20} color="#fff" />;
        if (t?.includes('lorry') || t?.includes('truck')) return <Truck size={20} color="#fff" />;
        if (t?.includes('tractor')) return <Tractor size={20} color="#fff" />;
        if (t?.includes('bus')) return <Bus size={20} color="#fff" />;
        return <Car size={20} color="#fff" />;
    };

    const qrUrl = `${window.location.origin}/check-details?reg=${encodeURIComponent(vehicle.regNumber || vehicle.registrationNumber)}`;
    const regNumber = vehicle.regNumber || vehicle.registrationNumber;

    return (
        <div className="fixed left-[-9999px]" aria-hidden="true">
            <div
                ref={ref}
                className="w-[800px] h-[1120px] bg-white text-black font-sans"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {/* Main Container with Border */}
                <div className="m-6 h-[calc(100%-48px)] border-2 border-gray-300 rounded-lg overflow-hidden flex flex-col">

                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-red-700 to-red-600 text-white px-6 py-5">
                        <div className="flex items-center gap-4">
                            <img src={logo} alt="DMT Logo" className="h-16 w-16 object-contain rounded-lg bg-white/10 p-1" />
                            <div>
                                <h1 className="text-xl font-bold tracking-wide uppercase">Department of Motor Traffic</h1>
                                <p className="text-red-100 text-sm">Democratic Socialist Republic of Sri Lanka</p>
                            </div>
                        </div>
                    </div>

                    {/* Title Bar */}
                    <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 text-center">
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest">Certificate of Registration of Vehicle (CRV)</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Issued under the Motor Traffic Act (Chapter 203)</p>
                    </div>

                    {/* Registration Number Display */}
                    <div className="bg-yellow-50 border-b-2 border-yellow-200 px-6 py-6">
                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-red-600 p-2 rounded-lg">
                                {getVehicleIcon(vehicle.vehicleClass || vehicle.vehicleType)}
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Registration Number</p>
                                <p className="text-4xl font-black tracking-[0.15em] text-gray-900 font-mono mt-1">{regNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 p-6 space-y-5 overflow-hidden">

                        {/* Owner Details */}
                        <div>
                            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-4 h-0.5 bg-red-600"></span>
                                Owner Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Full Name (Absolute Owner)</p>
                                    <p className="text-lg font-bold text-gray-900">{vehicle.ownerName || vehicle.fullName || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">National ID / Passport</p>
                                    <p className="text-base font-medium text-gray-800 font-mono">{vehicle.nationalIdNo || vehicle.nid || vehicle.ownerNIC || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Contact</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.ownerEmail || vehicle.email || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Address</p>
                                    <p className="text-base text-gray-700">{vehicle.permanentAddress || vehicle.address || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div>
                            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-4 h-0.5 bg-red-600"></span>
                                Vehicle Information
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Make & Model</p>
                                    <p className="text-base font-bold text-gray-900">{vehicle.makeModel || `${vehicle.makeOfVehicle || ''} ${vehicle.modelOfVehicle || ''}`.trim() || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Year</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.yearOfManufacture || vehicle.year || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Class</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.vehicleClass || vehicle.vehicleType || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Chassis Number</p>
                                    <p className="text-base font-mono text-gray-800 tracking-wide">{vehicle.chassisNumber || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Engine Number</p>
                                    <p className="text-base font-mono text-gray-800 tracking-wide">{vehicle.engineNumber || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Fuel Type</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.fuelType || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Engine Capacity</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.engineCapacity ? `${vehicle.engineCapacity} CC` : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Color</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.colorOfVehicle || vehicle.color || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold">No. of Owners</p>
                                    <p className="text-base font-medium text-gray-800">{vehicle.noOfOwners || vehicle.owners || 1}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                        <div className="flex justify-between items-end">
                            {/* QR Code */}
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <QRCodeCanvas
                                        value={qrUrl}
                                        size={100}
                                        level={"H"}
                                        includeMargin={false}
                                        fgColor="#1f2937"
                                        bgColor="#FFFFFF"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Scan to Verify</p>
                                    <p className="text-[8px] text-gray-400 mt-1 max-w-[180px] break-all font-mono">{qrUrl}</p>
                                </div>
                            </div>

                            {/* Signature */}
                            <div className="text-right">
                                <div className="h-12 flex items-end justify-end">
                                    <span className="font-serif italic text-2xl text-gray-600 transform -rotate-3">Commissioner</span>
                                </div>
                                <div className="border-t border-gray-400 w-48 ml-auto mt-1 pt-1">
                                    <p className="text-xs font-bold text-gray-700 uppercase">Commissioner General</p>
                                    <p className="text-[10px] text-gray-500">Department of Motor Traffic</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Strip */}
                    <div className="bg-gray-800 text-white text-[9px] py-2 px-4 text-center uppercase tracking-[0.15em]">
                        <span>Digital Document</span>
                        <span className="mx-2">•</span>
                        <span>Valid Without Signature</span>
                        <span className="mx-2">•</span>
                        <span>Verify at dmt.gov.lk</span>
                        <span className="mx-2">•</span>
                        <span>Generated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

CRVDocument.displayName = 'CRVDocument';
