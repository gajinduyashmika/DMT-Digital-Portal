import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white hover:text-red-700 transition-colors">
                  {t('about_us')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-red-700 transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white hover:text-red-700 transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-white hover:text-red-700 transition-colors">
                  {t('support')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact')}</h3>
            <ul className="space-y-2">
              <li>📧 support@dmtdigitalportal.com</li>
              <li>📞 +94 711 070 737</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('follow_us')}</h3>
            <div className="flex gap-4">
              <Facebook className="w-6 h-6 cursor-pointer hover:text-red-700 transition-colors" />
              <Twitter className="w-6 h-6 cursor-pointer hover:text-red-700 transition-colors" />
              <Linkedin className="w-6 h-6 cursor-pointer hover:text-red-700 transition-colors" />
              <Instagram className="w-6 h-6 cursor-pointer hover:text-red-700 transition-colors" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('newsletter')}</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t('enter_email')}
                className="px-4 py-2 rounded-full flex-grow"
              />
              <button className="px-4 py-2 rounded-full bg-red-700 text-white hover:bg-red-800 transition-colors">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-gray-800">
          <p>&copy; 2025 {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};