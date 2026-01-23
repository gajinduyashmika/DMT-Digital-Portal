import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

export const NotFound = () => {
    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                ></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="flex justify-center items-center gap-4 mb-8">
                    {['4', '0', '4'].map((number, index) => (
                        <div
                            key={index}
                            className={`text-8xl md:text-9xl font-black ${index === 1
                                    ? 'bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent'
                                    : 'text-white'
                                }`}
                        >
                            {number}
                        </div>
                    ))}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-bounce">
                        <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        Page Not Found
                    </h2>

                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                        Oops! The page you're looking for seems to have disappeared into the digital void.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-500/25"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm mb-4">Or try these popular pages:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: 'Dashboard', path: '/dashboard' },
                            { label: 'Vehicle Search', path: '/vehiclesearch' },
                            { label: 'Support', path: '/support' },
                        ].map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className="px-4 py-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};
