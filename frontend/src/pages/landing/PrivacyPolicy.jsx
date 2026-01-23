import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileText, Calendar, ChevronRight } from 'lucide-react';

export const PrivacyPolicy = () => {
    const { t } = useTranslation();

    const keyPoints = [
        { icon: Shield, title: t('data_protection'), desc: t('data_protection_desc'), gradient: 'from-blue-500 to-cyan-500' },
        { icon: Lock, title: t('data_security'), desc: t('data_security_desc'), gradient: 'from-purple-500 to-pink-500' },
        { icon: Eye, title: t('data_transparency'), desc: t('data_transparency_desc'), gradient: 'from-orange-500 to-red-500' },
        { icon: FileText, title: t('data_rights'), desc: t('data_rights_desc'), gradient: 'from-green-500 to-emerald-500' },
    ];

    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
            <section className="relative z-10 pt-8 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">Legal Document</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {t('privacy_policy')}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{t('last_updated')}: March 15, 2025</span>
                    </div>
                </div>
            </section>

            {/* Key Points */}
            <section className="relative z-10 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {keyPoints.map((point, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${point.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <point.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{point.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Policy */}
            <section className="relative z-10 py-12 pb-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10">
                        <div className="space-y-10">
                            {[1, 2, 3, 4, 5, 6].map((section) => (
                                <div key={section} className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                            {section}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                                            {t(`privacy_section_${section}_title`)}
                                        </h2>
                                    </div>
                                    <div className="pl-11">
                                        <p className="text-gray-400 leading-relaxed">
                                            {t(`privacy_section_${section}_content`)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Questions About Privacy?</h3>
                                        <p className="text-gray-400 mb-4">If you have any questions about our privacy practices, please contact our Data Protection Officer.</p>
                                        <a
                                            href="/support"
                                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
                                        >
                                            Contact Support
                                            <ChevronRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
