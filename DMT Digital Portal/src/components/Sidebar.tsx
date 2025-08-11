import React from 'react';
import { NavLink } from 'react-router-dom';
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

const translations = {
  en: {
    dashboard: 'Dashboard',
    addVehicle: 'Add New Vehicle',
    myVehicles: 'My Vehicles',
    transfer: 'Transfer Ownership',
    status: 'Application Status',
    settings: 'Settings',
    logout: 'Logout',
  },
  si: {
    dashboard: 'උපකරණ පුවරුව',
    addVehicle: 'නව වාහනයක් එකතු කරන්න',
    myVehicles: 'මගේ වාහන',
    transfer: 'අයිතිය මාරු කිරීම',
    status: 'අයදුම්පත් තත්ත්වය',
    settings: 'සැකසුම්',
    logout: 'ඉවත් වන්න',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    addVehicle: 'புதிய வாகனம் சேர்க்க',
    myVehicles: 'எனது வாகனங்கள்',
    transfer: 'உரிமை மாற்றம்',
    status: 'விண்ணப்ப நிலை',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
  },
};

const navItems = [
  { icon: Home, label: 'dashboard', path: '/dashboard' },
  { icon: PlusCircle, label: 'addVehicle', path: '/add-vehicle' },
  { icon: Car, label: 'myVehicles', path: '/my-vehicles' },
  { icon: RefreshCw, label: 'transfer', path: '/transfer' },
  { icon: Inbox, label: 'status', path: '/status' },
  { icon: Settings, label: 'settings', path: '/settings' },
];

export const Sidebar = () => {
  const { isCollapsed, setCollapsed, language, isDarkMode } = useStore();

  return (
    <div
      className={cn(
        'flex h-screen flex-col justify-between bg-red-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div>
        <div className="flex items-center justify-between p-4">
          <h2 className={cn('font-bold', isCollapsed ? 'hidden' : 'block')}>
            DMT Dashboard
          </h2>
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
                <span className="text-sm">{translations[language][label]}</span>
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
            <span className="text-sm">{translations[language].logout}</span>
          )}
        </NavLink>
      </div>
    </div>
  );
};