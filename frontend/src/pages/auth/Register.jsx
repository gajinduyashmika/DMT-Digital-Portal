import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CreditCard, ArrowRight, Sparkles, Car, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../components/ToastContainer';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export const Register = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '94',
        nationalId: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
        if (errors.phone) {
            setErrors((prev) => ({ ...prev, phone: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        if (!formData.fullName.trim()) validationErrors.fullName = 'Full name is required';

        if (!formData.email) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone) validationErrors.phone = 'Phone number is required';

        if (!formData.nationalId.trim()) validationErrors.nationalId = 'National ID / Passport is required';

        if (!formData.address.trim()) validationErrors.address = 'Address is required';

        if (!formData.password) {
            validationErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            validationErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            showToast('success', res.data.message || t('registered_successfully'));
            navigate('/login');
        } catch (err) {
            showToast('error', err.response?.data?.message || t('something_went_wrong'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex min-h-screen">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-gray-900 via-gray-900 to-black overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">Safe & Secure</span>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4">
                        Join Our<br />Community Today
                    </h2>
                    <p className="text-gray-400 max-w-md mb-8">
                        Create your account and start managing your vehicle registrations with ease.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4 text-left max-w-sm">
                        {[
                            'Quick and easy registration process',
                            'Track all your applications in one place',
                            'Secure document storage',
                            '24/7 customer support',
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-red-400" />
                                </div>
                                <span className="text-gray-300 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        {[
                            { value: '50K+', label: 'Active Users' },
                            { value: '100%', label: 'Secure' },
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

            {/* Right Side - Form */}
            <div className="flex-1 flex justify-center items-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-2"></div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('register_heading')}</h1>
                        <p className="text-gray-500">Create your account to get started.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                {t('full_name')}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder={t('full_name_hint')}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {t('email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('email_hint')}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                {t('phone')}
                            </label>
                            <PhoneInput
                                country={'lk'}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder={t('phone_hint')}
                                inputClass="!w-full !py-3 !pl-14 !pr-4 !rounded-xl !border !border-gray-200 focus:!ring-2 focus:!ring-red-100 focus:!border-red-500 !outline-none !transition-all !h-[50px]"
                                buttonClass="!border !border-gray-200 !rounded-l-xl !bg-gray-50"
                                dropdownClass="!border !border-gray-200 !rounded-xl !shadow-lg"
                                containerClass="!w-full"
                                enableSearch
                                inputProps={{ id: 'phone' }}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* National ID */}
                        <div className="space-y-1.5">
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                                {t('national_id')}
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="nationalId"
                                    value={formData.nationalId}
                                    onChange={handleChange}
                                    placeholder={t('national_id_hint')}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.nationalId ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                />
                            </div>
                            {errors.nationalId && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.nationalId}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                {t('address')}
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    id="address"
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder={t('address_hint')}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.address ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                        } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all resize-none`}
                                />
                            </div>
                            {errors.address && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Passwords in row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    {t('password')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-12 pr-10 py-3 rounded-xl border ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                            } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    {t('confirm_password')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-12 pr-10 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
                                            } focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group pt-2">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500" required />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                I agree to the <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-red-600 hover:text-red-700 font-medium">Privacy Policy</Link>
                            </span>
                        </label>

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
                                    {t('register_button')}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {t('have_account')}{' '}
                            <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                                {t('sign_in')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};
