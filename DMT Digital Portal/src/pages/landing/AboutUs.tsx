import { Building, Users, Target, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('about_us')}</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('about_hero_description')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold mb-4">{t('our_mission')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('mission_description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold mb-4">{t('our_vision')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('vision_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('our_values')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Building className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('value_1_title')}</h3>
              <p className="text-gray-600">{t('value_1_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Users className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('value_2_title')}</h3>
              <p className="text-gray-600">{t('value_2_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Target className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('value_3_title')}</h3>
              <p className="text-gray-600">{t('value_3_desc')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Award className="w-12 h-12 text-red-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('value_4_title')}</h3>
              <p className="text-gray-600">{t('value_4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">{t('our_team')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <img
                  src={`https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg`}
                  alt={t(`team_member_${member}_name`)}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{t(`team_member_${member}_name`)}</h3>
                <p className="text-gray-600">{t(`team_member_${member}_position`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};