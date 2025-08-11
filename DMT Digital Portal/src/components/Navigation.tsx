import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-black/95 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="hidden md:flex gap-8">
              <Link to="/" className="text-white hover:text-red-700 transition-colors">
                {t('home')}
              </Link>
              <Link to="/register" className="text-white hover:text-red-700 transition-colors">
                {t('register_vehicle')}
              </Link>
              <Link to="/check-details" className="text-white hover:text-red-700 transition-colors">
                {t('check_details')}
              </Link>
              <Link to="/about" className="text-white hover:text-red-700 transition-colors">
                {t('about_us')}
              </Link>
              <Link to="/support" className="text-white hover:text-red-700 transition-colors">
                {t('contact')}
              </Link>
            </div>
            <div className="hidden md:flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors"
              >
                {t('register')}
              </Link>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 px-4 py-2">
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-white py-2">
              {t('home')}
            </Link>
            <Link to="/register-vehicle" className="text-white py-2">
              {t('register_vehicle')}
            </Link>
            <Link to="/check-details" className="text-white py-2">
              {t('check_details')}
            </Link>
            <Link to="/upload" className="text-white py-2">
              {t('upload')}
            </Link>
            <Link to="/contact" className="text-white py-2">
              {t('contact')}
            </Link>
            <Link
              to="/login"
              className="w-full text-center py-2 rounded-full border border-white text-white"
            >
              {t('login')}
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-2 rounded-full bg-red-700 text-white"
            >
              {t('register')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};