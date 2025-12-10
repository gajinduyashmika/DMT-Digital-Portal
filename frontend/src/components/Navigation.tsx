import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ToastContainer';

export const Navigation = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(!!localStorage.getItem('token'));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    setIsAuthed(false);
    setShowLogoutModal(false);
    showToast('success', t('logged_out_successfully'));
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

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
              {isAuthed ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors"
                  >
                    {t('go_to_dashboard')}
                  </Link>
                  <button
                    onClick={openLogoutModal}
                    className="px-4 py-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors"
                  >
                    {t('logout')}
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
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
            <Link to="/register" className="text-white py-2">
              {t('register_vehicle')}
            </Link>
            <Link to="/check-details" className="text-white py-2">
              {t('check_details')}
            </Link>
            <Link to="/support" className="text-white py-2">
              {t('contact')}
            </Link>
            {isAuthed ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2 rounded-full border border-white text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('go_to_dashboard')}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLogoutModal();
                  }}
                  className="w-full text-center py-2 rounded-full bg-red-700 text-white"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center py-2 rounded-full border border-white text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2 rounded-full bg-red-700 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={cancelLogout}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('confirm_logout')}</h2>
            <p className="text-gray-600 mb-8">{t('logout_message')}</p>
            <div className="flex gap-4">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors font-medium"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};