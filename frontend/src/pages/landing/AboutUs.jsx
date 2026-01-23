import { Building, Users, Target, Award, Sparkles, Globe, Shield, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutUs = () => {
    const { t } = useTranslation();

    const values = [
        { icon: Building, title: t('value_1_title'), desc: t('value_1_desc'), gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: t('value_2_title'), desc: t('value_2_desc'), gradient: 'from-purple-500 to-pink-500' },
        { icon: Target, title: t('value_3_title'), desc: t('value_3_desc'), gradient: 'from-orange-500 to-red-500' },
        { icon: Award, title: t('value_4_title'), desc: t('value_4_desc'), gradient: 'from-green-500 to-emerald-500' },
    ];

    return (
        <main className="flex-1 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                ></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-8 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Sparkles className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-300">{t('about_us')}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {t('about_us')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('about_hero_description')}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        {[
                            { value: '10+', label: 'Years Experience' },
                            { value: '1M+', label: 'Vehicles Registered' },
                            { value: '99%', label: 'Satisfaction Rate' },
                            { value: '24/7', label: 'Support Available' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                                <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="relative z-10 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:border-red-500/30">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Globe className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">{t('our_mission')}</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {t('mission_description')}
                            </p>
                        </div>
                        <div className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:border-blue-500/30">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">{t('our_vision')}</h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {t('vision_description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="relative z-10 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">{t('our_values')}</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <value.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="relative z-10 py-20 pb-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">{t('our_team')}</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Meet the dedicated professionals behind our success
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[1, 2, 3].map((member) => (
                            <div
                                key={member}
                                className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative mx-auto w-32 h-32 mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                    <img
                                        src={`https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg`}
                                        alt={t(`team_member_${member}_name`)}
                                        className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20 group-hover:border-red-500/50 transition-colors"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-1">{t(`team_member_${member}_name`)}</h3>
                                <p className="text-red-400 text-sm mb-3">{t(`team_member_${member}_position`)}</p>
                                <div className="flex justify-center gap-3">
                                    <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                                        <Heart className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};
