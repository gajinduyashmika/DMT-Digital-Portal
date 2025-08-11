import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Support = () => {
  const { t } = useTranslation();

  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-black to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">{t('contact_support')}</h1>
          <p className="mt-4 opacity-90">{t('contact_description')}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">{t('send_message')}</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-700 outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                >
                  {t('send_message')}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('contact_info')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-red-700 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{t('phone')}</h3>
                      <p className="text-gray-600">+94 711 070 737</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-red-700 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{t('email')}</h3>
                      <p className="text-gray-600">support@dmtdigitalportal.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-red-700 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{t('address')}</h3>
                      <p className="text-gray-600">{t('office_address')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-red-700 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{t('working_hours')}</h3>
                      <p className="text-gray-600">{t('office_hours')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">{t('location')}</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128558!2d79.86074731477235!3d6.921885995003899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259251b57a431%3A0x8f44e226d6d20a52!2sDepartment%20of%20Motor%20Traffic!5e0!3m2!1sen!2sus!4v1647331851244!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};