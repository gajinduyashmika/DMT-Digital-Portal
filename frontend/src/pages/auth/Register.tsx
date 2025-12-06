import { Eye, EyeOff } from 'lucide-react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData> & { confirmPassword?: string }>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '94',
    nationalId: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors: Partial<FormData> & { confirmPassword?: string } = {};

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

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success(res.data.message || t('registered_successfully'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('something_went_wrong'));
    }
  };

  return (
    <main className="flex-1 flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {t('register_heading')}
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              {t('full_name')}
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('full_name_hint')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('email_hint')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone with Country Code */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              {t('phone')}
            </label>
            <PhoneInput
                country={'lk'}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={t('phone_hint')}
              inputClass="!w-full !py-3 !pl-12 !pr-4 !rounded-lg !border !border-gray-300 focus:!ring-2 focus:!ring-red-100 focus:!border-red-700 outline-none transition-colors"
              buttonClass="!border !border-gray-300"
              dropdownClass="!border !border-gray-300"
              enableSearch
              inputProps={{ id: 'phone' }}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.phone}
              </p>
            )}
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
              {t('national_id')}
            </label>
            <input
              type="text"
              id="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder={t('national_id_hint')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
            />
            {errors.nationalId && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.nationalId}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              {t('address')}
            </label>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder={t('address_hint')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.address}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('password_hint')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              {t('confirm_password')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('confirm_password_hint')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
          >
            {t('register_button')}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('have_account')}{' '}
            <Link to="/login" className="text-red-700 hover:text-red-800 font-medium">
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
