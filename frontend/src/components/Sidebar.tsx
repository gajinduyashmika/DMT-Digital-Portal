import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  Car,
  RefreshCw,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import logo from '../assets/corner_logo.png';

const translations = {
  en: {
    dashboard: 'Dashboard',
    addVehicle: 'Register a Vehicle',
    myVehicles: 'My Vehicles',
    transfer: 'Transfer Ownership',
    status: 'Application Status',
    settings: 'Settings',
    logout: 'Logout',
  },
  si: {
    dashboard: 'උපකරණ පුවරුව',
    addVehicle: 'වාහනයක් ලියාපදිංචි කරන්න',
    myVehicles: 'මගේ වාහන',
    transfer: 'අයිතිය මාරු කිරීම',
    status: 'අයදුම්පත් තත්ත්වය',
    settings: 'සැකසුම්',
    logout: 'ඉවත් වන්න',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    addVehicle: 'வாகனத்தை பதிவு செய்க',
    myVehicles: 'எனது வாகனங்கள்',
    transfer: 'உரிமை மாற்றம்',
    status: 'விண்ணப்ப நிலை',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
  },
};


type TranslationKey = keyof typeof translations.en;

const navItems = [
  { icon: Home, label: 'dashboard' as TranslationKey, path: '/dashboard' },
  { icon: PlusCircle, label: 'addVehicle' as TranslationKey, path: '/register-vehicle' },
  { icon: Car, label: 'myVehicles' as TranslationKey, path: '/my-vehicles' },
  { icon: RefreshCw, label: 'transfer' as TranslationKey, path: '/transfer' },
  { icon: Inbox, label: 'status' as TranslationKey, path: '/status' },
  { icon: Settings, label: 'settings' as TranslationKey, path: '/settings' },
];

export const Sidebar = () => {
  const { isCollapsed, setCollapsed, language } = useStore();
  const lang = (language as keyof typeof translations) ?? 'en';

  return (
    <div
      className={cn(
        'flex h-screen flex-col justify-between bg-red-900 text-white transition-all duration-300 sticky top-0 self-start overflow-hidden',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0" aria-label="Go to home">
              <img
                src={logo}
                alt="DMT Home"
                className={cn(
                  'rounded-full border',
                  isCollapsed ? 'h-7 w-7' : 'h-10 w-10'
                )}
              />
            </Link>
            <h2 className={cn('font-bold', isCollapsed ? 'hidden' : 'block')}>
              DMT Dashboard
            </h2>
            
          </div>
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 hover:bg-red-950"
          >
            {isCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
        </div>

        <nav className="mt-4 px-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 rounded-lg px-4 py-3 transition-colors',
                  isActive
                    ? 'bg-red-950 text-white'
                    : 'text-white/80 hover:bg-red-950/50'
                )
              }
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className="text-sm">{translations[lang][label]}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-2">
        <NavLink
          to="/logout"
          className={cn(
            'flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-red-950/50',
            'text-white/80'
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="text-sm">{translations[lang].logout}</span>
          )}
        </NavLink>
      </div>
    </div>
  );
};