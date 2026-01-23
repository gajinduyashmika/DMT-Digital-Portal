import { Search, Car, Shield, FileSearch, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export const VehicleSearch = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [regNumber, setRegNumber] = useState(searchParams.get('reg') || '');
    const [requesterNIC, setRequesterNIC] = useState('');
    const [requesterPhone, setRequesterPhone] = useState('');
    const [error, setError] = useState('');
    const [isHuman, setIsHuman] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

    const handleSearch = (e) => {
        e.preventDefault();
        const value = regNumber.trim().toUpperCase();
        // Accept common Sri Lankan formats like ABC-1234 or 12-3456 (basic check)
        const platePattern = /^(?:[A-Z]{2,3}-\d{4}|\d{2}-\d{4})$/;

        if (!regNumber || !requesterNIC || !requesterPhone) {
            setError('Registration number, NIC, and Phone number are required');
            return;
        }

        if (!platePattern.test(value)) {
            setError('Enter a valid registration number (e.g., CAY-5555 or 32-7674)');
            return;
        }

        if (!captchaToken) {
            setError('Please verify you are not a robot');
            return;
        }

        setError('');
        navigate(`/vehicleinfo/${value}`, {
            state: { requesterNIC, requesterPhone }
        });
    };

    const features = [
        { icon: Car, title: 'Vehicle Details', desc: 'Get complete vehicle information' },
        { icon: Shield, title: 'Status Check', desc: 'Verify registration status' },
        { icon: FileSearch, title: 'History', desc: 'View ownership history' },
    ];

    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
            <section className="relative z-10 pt-8 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Search className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-300">Vehicle Search Portal</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            {t('check_vehicle_details')}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            {t('vehicle_search_description')}
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <FileSearch className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{t('search_vehicle')}</h2>
                                    <p className="text-sm text-gray-400">
                                        {t('example_numbers')}: CAY-5555, 32-7674, KY-1234
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-6" noValidate>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Car className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={regNumber}
                                        onChange={(e) => {
                                            setRegNumber(e.target.value.toUpperCase());
                                            if (error) setError('');
                                        }}
                                        placeholder={t('enter_reg_number')}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-lg placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all uppercase tracking-wider"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={requesterNIC}
                                            onChange={(e) => setRequesterNIC(e.target.value)}
                                            placeholder="Your NIC Number"
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={requesterPhone}
                                            onChange={(e) => setRequesterPhone(e.target.value)}
                                            placeholder="Your Phone Number"
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <div className="flex justify-center bg-white/5 rounded-xl p-4">
                                    <ReCAPTCHA
                                        sitekey={siteKey}
                                        onChange={(token) => {
                                            setCaptchaToken(token);
                                            setIsHuman(!!token);
                                            if (error) setError('');
                                        }}
                                        onExpired={() => {
                                            setCaptchaToken(null);
                                            setIsHuman(false);
                                        }}
                                        theme="dark"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isHuman}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-red-600 disabled:hover:to-red-500"
                                >
                                    <Search className="w-5 h-5" />
                                    {t('search')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Info Banner */}
                    <div className="mt-16 max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Secure & Reliable</h3>
                                <p className="text-gray-400 text-sm">All searches are logged and protected. Your data is safe with us.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
