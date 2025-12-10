import React from 'react';
import { useStore } from '../../store/useStore';
import {
  Car,
  Clock,
  RefreshCw,
  CheckCircle,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const translations = {
  en: {
    welcome: 'Welcome to DMT Dashboard',
    stats: {
      total: 'Total Vehicles',
      pending: 'Pending Applications',
      transfer: 'Transfer Requests',
      approved: 'Approved Applications',
    },
    quickActions: 'Quick Actions',
    actions: {
      register: 'Register New Vehicle',
      transfer: 'Transfer Ownership',
      status: 'Check Status',
    },
    recentActivity: 'Recent Activity',
  },
  si: {
    welcome: 'DMT උපකරණ පුවරුවට සාදරයෙන් පිළිගනිමු',
    stats: {
      total: 'මුළු වාහන',
      pending: 'අපේක්ෂිත අයදුම්පත්',
      transfer: 'මාරු කිරීමේ ඉල්ලීම්',
      approved: 'අනුමත කළ අයදුම්පත්',
    },
    quickActions: 'ක්ෂණික ක්‍රියාමාර්ග',
    actions: {
      register: 'නව වාහනයක් ලියාපදිංචි කරන්න',
      transfer: 'අයිතිය මාරු කරන්න',
      status: 'තත්ත්වය පරීක්ෂා කරන්න',
    },
    recentActivity: 'මෑත ක්‍රියාකාරකම්',
  },
  ta: {
    welcome: 'DMT டாஷ்போர்டுக்கு வரவேற்கிறோம்',
    stats: {
      total: 'மொத்த வாகனங்கள்',
      pending: 'நிலுவையில் உள்ள விண்ணப்பங்கள்',
      transfer: 'மாற்ற கோரிக்கைகள்',
      approved: 'அங்கீகரிக்கப்பட்ட விண்ணப்பங்கள்',
    },
    quickActions: 'விரைவு செயல்கள்',
    actions: {
      register: 'புதிய வாகனத்தை பதிவு செய்க',
      transfer: 'உரிமையை மாற்றவும்',
      status: 'நிலையை சரிபார்க்கவும்',
    },
    recentActivity: 'சமீபத்திய செயல்பாடு',
  },
};

import { useEffect, useState } from 'react';

export const Dashboard = () => {
  const { language, isDarkMode } = useStore();
  const [stats, setStats] = useState([
    { icon: Car, label: 'total', value: '0' },
    { icon: Clock, label: 'pending', value: '0' },
    { icon: RefreshCw, label: 'transfer', value: '0' },
    { icon: CheckCircle, label: 'approved', value: '0' },
  ]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch users (for demo, use as total users/vehicles)
        const usersRes = await axios.get('http://localhost:5000/api/auth/users');
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        
        // Set all stats to 0 if no data
        setStats([
          { icon: Car, label: 'total', value: String(users.length || 0) },
          { icon: Clock, label: 'pending', value: '0' },
          { icon: RefreshCw, label: 'transfer', value: '0' },
          { icon: CheckCircle, label: 'approved', value: '0' },
        ]);
        
        // For demo, use users as recent activity
        setRecentActivities(
          users.slice(0, 5).map((user: any, idx: number) => ({
            id: user._id || idx,
            vehicleNo: user.nationalId || 'N/A',
            action: user.fullName,
            time: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
          }))
        );
      } catch (err) {
        // Show 0s on error instead of '!'
        setStats([
          { icon: Car, label: 'total', value: '0' },
          { icon: Clock, label: 'pending', value: '0' },
          { icon: RefreshCw, label: 'transfer', value: '0' },
          { icon: CheckCircle, label: 'approved', value: '0' },
        ]);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
}, []);

const quickActions = [
    { icon: PlusCircle, label: 'register', path: '/add-vehicle' },
    { icon: RefreshCw, label: 'transfer', path: '/transfer' },
    { icon: AlertCircle, label: 'status', path: '/status' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-2xl font-bold">{translations[language].welcome}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <Icon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm opacity-70">
                  {translations[language].stats[label as keyof typeof translations.en.stats]}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="mb-4 text-xl font-semibold">
          {translations[language].quickActions}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map(({ icon: Icon, label, path }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 rounded-lg p-4 transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon className="h-6 w-6 text-red-600" />
              <span>
                {translations[language].actions[label as keyof typeof translations.en.actions]}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="mb-4 text-xl font-semibold">
          {translations[language].recentActivity}
        </h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-4 opacity-70">No recent activity found.</div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-medium">{activity.vehicleNo}</p>
                    <p className="text-sm opacity-70">{activity.action}</p>
                  </div>
                  <p className="text-sm opacity-70">{activity.time}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};