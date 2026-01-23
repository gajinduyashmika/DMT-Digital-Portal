import { Clock, Lock, QrCode, ArrowRight, Sparkles, Shield, Car, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Home = () => {
    const { t } = useTranslation();
    const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const features = [
        {
            icon: Clock,
            title: t('fast_processing'),
            desc: t('fast_processing_desc'),
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Lock,
            title: t('secure_verification'),
            desc: t('secure_verification_desc'),
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: QrCode,
            title: t('qr_verification'),
            desc: t('qr_verification_desc'),
            gradient: 'from-purple-500 to-pink-500'
        },
    ];

    const steps = [
        { icon: Car, title: t('step1_title'), desc: t('step1_desc') },
        { icon: FileCheck, title: t('step2_title'), desc: t('step2_desc') },
        { icon: Shield, title: t('step3_title'), desc: t('step3_desc') },
        { icon: CheckCircle2, title: t('step4_title'), desc: t('step4_desc') },
    ];

    return (
        <>
            {/* Full Screen Grid Pattern Background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient Orbs */}
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl" />

                    {/* Floating elements */}
                    <div className="absolute top-20 left-20 w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute bottom-40 right-40 w-3 h-3 bg-red-400 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-red-600 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <Sparkles className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-300">Official DMT Digital Portal</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                                {t('hero_title')}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {t('hero_subtitle')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to={isAuthed ? "/dashboard" : "/register"}
                                className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative flex items-center gap-2">
                                    {isAuthed ? t('go_to_dashboard') : t('register_now')}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                to="/check-details"
                                className="group px-8 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <span className="flex items-center gap-2">
                                    {t('check_vehicle')}
                                    <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </span>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            {[
                                { value: '10K+', label: 'Registered Vehicles' },
                                { value: '99.9%', label: 'Uptime' },
                                { value: '24/7', label: 'Support' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-300 font-medium mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom fade - Long dark gradient for readability */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t('why_choose_us')}
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Experience the most advanced vehicle registration system in Sri Lanka
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {/* Gradient background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                                {/* Icon */}
                                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="relative text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="relative text-gray-500 leading-relaxed">
                                    {feature.desc}
                                </p>

                                {/* Arrow indicator */}
                                <div className="relative mt-6 flex items-center gap-2 text-gray-400 group-hover:text-gray-900 transition-colors">
                                    <span className="text-sm font-medium">Learn more</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-4">
                            <FileCheck className="w-4 h-4" />
                            Process
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t('how_it_works')}
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Four simple steps to register your vehicle online
                        </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-200 to-transparent" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {steps.map((step, i) => (
                                <div key={i} className="group relative">
                                    {/* Card */}
                                    <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                                        {/* Step number */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                                            {i + 1}
                                        </div>

                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-auto mb-5 mt-4 group-hover:scale-110 transition-transform duration-300">
                                            <step.icon className="w-8 h-8 text-red-600" />
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <Link
                            to={isAuthed ? "/dashboard" : "/register"}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};
