import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../assets/corner_logo.png';


export const TopBar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="bg-white py-2 border-b border-gray-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
  src={logo}
  alt="DMT Logo"
  className="w-10 h-10 object-contain"
/>
          <span className="text-2xl font-bold text-black">DMT DIGITAL PORTAL</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <button
            className={`${i18n.language === 'si' ? 'text-red-700 font-medium' : 'text-gray-600'}`}
            onClick={() => changeLanguage('si')}
          >
            සිංහල
          </button>
          <span className="text-gray-300">|</span>
          <button
            className={`${i18n.language === 'en' ? 'text-red-700 font-medium' : 'text-gray-600'}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <span className="text-gray-300">|</span>
          <button
            className={`${i18n.language === 'ta' ? 'text-red-700 font-medium' : 'text-gray-600'}`}
            onClick={() => changeLanguage('ta')}
          >
            தமிழ்
          </button>
        </div>
      </div>
    </div>
  );
};
