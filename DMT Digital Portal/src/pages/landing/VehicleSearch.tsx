import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const VehicleSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regNumber, setRegNumber] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (regNumber.trim()) {
      navigate(`/vehicleinfo/${regNumber.toUpperCase()}`);
    }
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
            <form onSubmit={handleSearch} className="space-y-4">
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder={t('enter_reg_number')}
                className="w-full px-4 py-3 rounded-lg text-black"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
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