import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Headphones, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const Support = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const contactCards = [
        { icon: Phone, title: t('phone'), value: '+94 711 070 737', gradient: 'from-green-500 to-emerald-500' },
        { icon: Mail, title: t('email'), value: 'support@dmtdigitalportal.com', gradient: 'from-blue-500 to-cyan-500' },
        { icon: MapPin, title: t('address'), value: t('office_address'), gradient: 'from-purple-500 to-pink-500' },
        { icon: Clock, title: t('working_hours'), value: t('office_hours'), gradient: 'from-orange-500 to-red-500' },
    ];

    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
                        <Headphones className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">24/7 Support Available</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {t('contact_support')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('contact_description')}
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="relative z-10 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {contactCards.map((card, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-semibold mb-1">{card.title}</h3>
                                <p className="text-gray-400 text-sm">{card.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="relative z-10 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">{t('send_message')}</h2>
                            </div>

                            <form className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                            {t('full_name')}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            {t('email')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                        {t('subject')}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                        placeholder="Enter subject"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                        {t('message')}
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all resize-none"
                                        placeholder="Type your message here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                                >
                                    <Send className="w-5 h-5" />
                                    {t('send_message')}
                                </button>
                            </form>
                        </div>

                        {/* Map Section */}
                        <div className="space-y-6">
                            {/* Quick Support Info */}
                            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Need Urgent Help?</h3>
                                        <p className="text-gray-400">Our support team is available 24/7</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <a href="tel:+94711070737" className="flex-1 py-3 px-4 bg-white/10 rounded-xl text-center text-white font-medium hover:bg-white/20 transition-colors">
                                        Call Now
                                    </a>
                                    <a href="mailto:support@dmtdigitalportal.com" className="flex-1 py-3 px-4 bg-white/10 rounded-xl text-center text-white font-medium hover:bg-white/20 transition-colors">
                                        Email Us
                                    </a>
                                </div>
                            </div>

                            {/* Google Maps */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{t('location')}</h2>
                                </div>
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128558!2d79.86074731477235!3d6.921885995003899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259251b57a431%3A0x8f44e226d6d20a52!2sDepartment%20of%20Motor%20Traffic!5e0!3m2!1sen!2sus!4v1647331851244!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="grayscale hover:grayscale-0 transition-all duration-500"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
