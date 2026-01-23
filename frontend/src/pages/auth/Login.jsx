import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Car } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useToast } from '../../components/ToastContainer';
import axios from 'axios';

export const Login = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserEmail, setUserName } = useStore();

    const handleLogin = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', res.data.fullName || email.split('@')[0]);
            setUserEmail(email);
            setUserName(res.data.fullName || email.split('@')[0]);
            showToast('success', t('login_success') || 'Login Successful');
            navigate('/');
        } catch (err) {
            console.error(err);
            showToast('error', err.response?.data?.message || t('something_went_wrong'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex min-h-screen">
            {/* Left Side - Form */}
            <div className="flex-1 flex justify-center items-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="mb-2"></div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login_heading')}</h1>
                        <p className="text-gray-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin} noValidate>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    placeholder={t('email_hint')}
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t('password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                                    }}
                                    placeholder={t('password_hint')}
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{t('remember_me')}</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                                {t('forgot_password')}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t('login_button')}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {t('no_account')}{' '}
                            <Link to="/register" className="text-red-600 hover:text-red-700 font-semibold">
                                {t('sign_up')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-gray-900 via-gray-900 to-black overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">Secure & Trusted</span>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4">
                        Welcome to<br />Vehicle Registration
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Access your dashboard to manage vehicle registrations, track applications, and more.
                    </p>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        {[
                            { value: '10K+', label: 'Registered Users' },
                            { value: '24/7', label: 'Support Available' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};
