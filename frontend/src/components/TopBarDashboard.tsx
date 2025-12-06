import { useState } from 'react';
import { Bell, Globe, User, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

export const TopBarDashboard = () => {
  const { language, setLanguage, isDarkMode, setDarkMode } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Get the username from localStorage
  const username = localStorage.getItem('username') || 'User';

  const notifications = [
    { id: 1, text: 'Your vehicle registration was approved', time: '5m ago' },
    { id: 2, text: 'New transfer request received', time: '1h ago' },
    { id: 3, text: 'Document verification pending', time: '2h ago' },
  ];

  return (
    <div className={`flex h-16 items-center justify-between border-b px-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!isDarkMode)}
          className={`rounded-lg p-2 transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className={`appearance-none rounded-lg border px-3 py-2 pr-8 text-sm focus:border-red-500 focus:outline-none ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-transparent'
            }`}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <Globe className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative rounded-full p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4">
                <h3 className="font-semibold">Notifications</h3>
                <div className="mt-2 space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg p-3 ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm">{notification.text}</p>
                      <p className="mt-1 text-xs opacity-70">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-2 rounded-full border p-2 ${
              isDarkMode
                ? 'border-gray-700 hover:bg-gray-800'
                : 'border-gray-200 hover:bg-gray-100'
            }`}
          >
            <img
              src="https://bsmedia.business-standard.com/_media/bs/img/about-page/thumb/464_464/1649933026.jpg"
              alt="User"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{username}</span>
            <User className="h-4 w-4 opacity-70" />
          </button>

          {showProfile && (
            <div
              className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-2">
                <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`} onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  window.location.href = '/login'; // Redirect to login
                }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
