import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('privacy_policy')}</h1>
          <p className="mt-4 opacity-90">{t('last_updated')}: March 15, 2025</p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Shield className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('data_protection')}</h3>
              <p className="text-gray-600">{t('data_protection_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Lock className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('data_security')}</h3>
              <p className="text-gray-600">{t('data_security_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Eye className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('data_transparency')}</h3>
              <p className="text-gray-600">{t('data_transparency_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <FileText className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('data_rights')}</h3>
              <p className="text-gray-600">{t('data_rights_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map((section) => (
              <div key={section}>
                <h2 className="text-2xl font-bold mb-4">{t(`privacy_section_${section}_title`)}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {t(`privacy_section_${section}_content`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};