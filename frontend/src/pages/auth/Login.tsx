import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContainer';
import axios from 'axios';

export const Login = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: { email?: string; password?: string } = {};
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

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      showToast('success', t('login_success') || 'Login Successful');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      showToast('error', err.response?.data?.message || t('something_went_wrong'));
    }
  };

  return (
    <main className="flex-1 flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('login_heading')}</h1>

        <form className="space-y-6" onSubmit={handleLogin} noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
              placeholder={t('email_hint')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
              required
            />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50 rounded px-3 py-1 border border-red-100">
                    {errors.email}
                  </p>
                )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder={t('password_hint')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none transition-colors"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-red-700 focus:ring-red-700" />
              <span className="text-sm text-gray-600">{t('remember_me')}</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-red-700 hover:text-red-800">
              {t('forgot_password')}
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
          >
            {t('login_button')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('no_account')}{' '}
            <Link to="/register" className="text-red-700 hover:text-red-800 font-medium">
              {t('sign_up')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
