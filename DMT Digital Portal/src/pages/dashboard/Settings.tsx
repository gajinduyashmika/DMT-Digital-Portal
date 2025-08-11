import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  LogOut,
  Smartphone,
  Globe,
  Upload,
  Trash,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';

const translations = {
  en: {
    title: 'Settings',
    sections: {
      profile: 'Profile Settings',
      notifications: 'Notification Preferences',
      security: 'Security & Privacy',
      activity: 'Login Activity',
    },
    fields: {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      language: 'Language',
    },
    notifications: {
      email: 'Email Notifications',
      sms: 'SMS Notifications',
      system: 'System Notifications',
    },
    buttons: {
      upload: 'Upload Photo',
      remove: 'Remove Photo',
      save: 'Save Changes',
      logout: 'Sign Out from All Devices',
      changePassword: 'Change Password',
    },
  },
  si: {
    title: 'සැකසුම්',
    sections: {
      profile: 'පැතිකඩ සැකසුම්',
      notifications: 'දැනුම්දීම් මනාප',
      security: 'ආරක්ෂාව සහ රහස්‍යතාව',
      activity: 'පිවිසුම් ක්‍රියාකාරකම්',
    },
    fields: {
      name: 'සම්පූර්ණ නම',
      email: 'විද්‍යුත් තැපෑල',
      phone: 'දුරකථන අංකය',
      currentPassword: 'වර්තමාන මුරපදය',
      newPassword: 'නව මුරපදය',
      confirmPassword: 'මුරපදය තහවුරු කරන්න',
      language: 'භාෂාව',
    },
    notifications: {
      email: 'විද්‍යුත් තැපෑල දැනුම්දීම්',
      sms: 'කෙටි පණිවුඩ දැනුම්දීම්',
      system: 'පද්ධති දැනුම්දීම්',
    },
    buttons: {
      upload: 'ඡායාරූපය උඩුගත කරන්න',
      remove: 'ඡායාරූපය ඉවත් කරන්න',
      save: 'වෙනස්කම් සුරකින්න',
      logout: 'සියලු උපාංග වලින් ඉවත් වන්න',
      changePassword: 'මුරපදය වෙනස් කරන්න',
    },
  },
  ta: {
    title: 'அமைப்புகள்',
    sections: {
      profile: 'சுயவிவர அமைப்புகள்',
      notifications: 'அறிவிப்பு விருப்பங்கள்',
      security: 'பாதுகாப்பு & தனியுரிமை',
      activity: 'உள்நுழைவு செயல்பாடு',
    },
    fields: {
      name: 'முழு பெயர்',
      email: 'மின்னஞ்சல் முகவரி',
      phone: 'தொலைபேசி எண்',
      currentPassword: 'தற்போதைய கடவுச்சொல்',
      newPassword: 'புதிய கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      language: 'மொழி',
    },
    notifications: {
      email: 'மின்னஞ்சல் அறிவிப்புகள்',
      sms: 'SMS அறிவிப்புகள்',
      system: 'கணினி அறிவிப்புகள்',
    },
    buttons: {
      upload: 'புகைப்படத்தை பதிவேற்றவும்',
      remove: 'புகைப்படத்தை அகற்று',
      save: 'மாற்றங்களை சேமி',
      logout: 'அனைத்து சாதனங்களிலிருந்தும் வெளியேறு',
      changePassword: 'கடவுச்சொல்லை மாற்று',
    },
  },
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

const loginActivity = [
  {
    id: 1,
    device: 'Chrome on Windows',
    ip: '192.168.1.1',
    timestamp: '2024-03-15 14:30',
    location: 'Colombo, Sri Lanka',
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    ip: '192.168.1.2',
    timestamp: '2024-03-14 09:15',
    location: 'Kandy, Sri Lanka',
  },
];

const currentUser = {
  name: 'Mohomed Paramee',
  email: 'paramee@example.com',
  phone: '+94 77 123 4567',
  profileImage: 'https://bsmedia.business-standard.com/_media/bs/img/about-page/thumb/464_464/1649933026.jpg',
};

export const Settings = () => {
  const { language, setLanguage, isDarkMode } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    system: true,
  });
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });
  
  const [isModified, setIsModified] = useState({
    profile: false,
    password: false,
  });
  
  const [profileImage, setProfileImage] = useState<string>(currentUser.profileImage);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(prev => ({ ...prev, profile: true }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(prev => ({ ...prev, password: true }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setIsModified(prev => ({ ...prev, profile: true }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileUpdate = () => {
    toast.success('Profile updated successfully!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: isDarkMode ? '#1F2937' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      },
    });
    setIsModified(prev => ({ ...prev, profile: false }));
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: isDarkMode ? '#1F2937' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
      });
      return;
    }
    
    toast.success('Password updated successfully!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: isDarkMode ? '#1F2937' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
      },
    });
    
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsModified(prev => ({ ...prev, password: false }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {translations[language].sections.profile}
          </h2>
          {isModified.profile && (
            <button
              onClick={handleProfileUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Save className="h-4 w-4" />
              <span>{translations[language].buttons.save}</span>
            </button>
          )}
        </div>

        <div className="mb-6 flex items-center gap-6">
          <div className="relative h-24 w-24">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-red-600 p-2 text-white hover:bg-red-700">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Upload className="h-4 w-4" />
            </label>
          </div>
          {profileImage && profileImage !== currentUser.profileImage && (
            <button
              onClick={() => {
                setProfileImage(currentUser.profileImage);
                setIsModified(prev => ({ ...prev, profile: true }));
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash className="h-4 w-4" />
              <span>{translations[language].buttons.remove}</span>
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {translations[language].fields.name}
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border pl-10 pr-4 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {translations[language].fields.email}
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-lg border pl-10 pr-4 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {translations[language].fields.phone}
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full rounded-lg border pl-10 pr-4 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {translations[language].fields.language}
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={`w-full appearance-none rounded-lg border pl-10 pr-4 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {translations[language].buttons.changePassword}
            </h3>
            {isModified.password && (
              <button
                onClick={handlePasswordUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Save className="h-4 w-4" />
                <span>{translations[language].buttons.save}</span>
              </button>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder={translations[language].fields.currentPassword}
                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder={translations[language].fields.newPassword}
                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={translations[language].fields.confirmPassword}
                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="mb-6 text-xl font-semibold">
          {translations[language].sections.notifications}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{translations[language].notifications.email}</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <span>{translations[language].notifications.sms}</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) =>
                  setNotifications({ ...notifications, sms: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <span>{translations[language].notifications.system}</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notifications.system}
                onChange={(e) =>
                  setNotifications({ ...notifications, system: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="mb-6 text-xl font-semibold">
          {translations[language].sections.activity}
        </h2>
        <div className="space-y-4">
          {loginActivity.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between rounded-lg p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div>
                <p className="font-medium">{activity.device}</p>
                <p className="text-sm opacity-70">
                  {activity.ip} • {activity.location}
                </p>
              </div>
              <p className="text-sm opacity-70">{activity.timestamp}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700">
          <LogOut className="h-4 w-4" />
          <span>{translations[language].buttons.logout}</span>
        </button>
      </div>
    </div>
  );
};