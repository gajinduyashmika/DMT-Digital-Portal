import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export const VehicleSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = regNumber.trim().toUpperCase();
    // Accept common Sri Lankan formats like ABC-1234 or 12-3456 (basic check)
    const platePattern = /^(?:[A-Z]{2,3}-\d{4}|\d{2}-\d{4})$/;

    if (!value) {
      setError('Registration number is required');
      return;
    }

    if (!platePattern.test(value)) {
      setError('Enter a valid registration number (e.g., CAY-5555 or 32-7674)');
      return;
    }

    if (!captchaToken) {
      setError('Please verify you are not a robot');
      return;
    }

    setError('');
    navigate(`/vehicleinfo/${value}`);
  };

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('check_vehicle_details')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
            {t('vehicle_search_description')}
          </p>

          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-8">{t('search_vehicle')}</h2>
            <p className="text-sm mb-4 opacity-80">
              {t('example_numbers')}: CAY-5555, 32-7674, KY-1234
            </p>
            <form onSubmit={handleSearch} className="space-y-4" noValidate>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => {
                  setRegNumber(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t('enter_reg_number')}
                className="w-full px-4 py-3 rounded-lg text-black"
              />
              {error && (
                <p className="text-sm text-red-200 bg-white/10 border border-red-300/40 rounded px-3 py-2 text-left">
                  {error}
                </p>
              )}
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={siteKey}
                  onChange={(token: string | null) => {
                    setCaptchaToken(token);
                    setIsHuman(!!token);
                    if (error) setError('');
                  }}
                  onExpired={() => {
                    setCaptchaToken(null);
                    setIsHuman(false);
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!isHuman}
              >
                {t('search')}
              </button>
            </form>
          </div>
        </div>
      </section>

      
    </main>
  );
};