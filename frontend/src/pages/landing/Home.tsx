import { Clock, Lock, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{t('hero_title')}</h1>
          <p className="text-xl opacity-90 mb-8">{t('hero_subtitle')}</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 text-xl rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors"
            >
              {t('register_now')}
            </Link>
            <Link
              to="/check-details"
              className="px-6 py-3 text-xl rounded-full bg-black text-white hover:bg-gray-900 transition-colors"
            >
              {t('check_vehicle')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('why_choose_us')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-300 rounded-lg text-center hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('fast_processing')}</h3>
              <p className="text-gray-600">{t('fast_processing_desc')}</p>
            </div>
            <div className="p-6 border border-gray-300 rounded-lg text-center hover:shadow-lg transition-shadow">
              <Lock className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('secure_verification')}</h3>
              <p className="text-gray-600">{t('secure_verification_desc')}</p>
            </div>
            <div className="p-6 border border-gray-300 rounded-lg text-center hover:shadow-lg transition-shadow">
              <QrCode className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('qr_verification')}</h3>
              <p className="text-gray-600">{t('qr_verification_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('how_it_works')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-red-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(`step${step}_title`)}</h3>
                <p className="text-gray-600">{t(`step${step}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};