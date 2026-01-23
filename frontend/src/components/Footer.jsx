import { Facebook, Twitter, Linkedin, Instagram, Car, Mail, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <div className="relative z-10">
                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white">DMT Digital Portal</h2>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                The official digital platform for vehicle registration in Sri Lanka.
                                Secure, efficient, and user-friendly services at your fingertips.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { Icon: Facebook, href: '#' },
                                    { Icon: Twitter, href: '#' },
                                    { Icon: Linkedin, href: '#' },
                                    { Icon: Instagram, href: '#' },
                                ].map(({ Icon, href }, i) => (
                                    <a
                                        key={i}
                                        href={href}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                                {t('quick_links')}
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { to: '/about', label: t('about_us') },
                                    { to: '/terms', label: t('terms') },
                                    { to: '/privacy', label: t('privacy') },
                                    { to: '/support', label: t('support') },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.to}
                                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-red-500" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                                {t('contact')}
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-300 text-sm">support@dmtdigitalportal.com</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <p className="text-gray-300 text-sm">+94 711 070 737</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Address</p>
                                        <p className="text-gray-300 text-sm">Colombo, Sri Lanka</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
                                {t('newsletter')}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Subscribe to get updates on new features and announcements.
                            </p>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder={t('enter_email')}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2 group">
                                    {t('subscribe')}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5">
                    <div className="container mx-auto px-6 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-gray-500 text-sm">
                                &copy; 2025 {t('copyright')}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                                <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
