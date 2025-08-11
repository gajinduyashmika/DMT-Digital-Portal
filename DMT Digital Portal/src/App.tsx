import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Layouts and Components
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { TopBar as MainTopBar } from './components/TopBar'; // Main TopBar
import { TopBarDashboard } from './components/TopBarDashboard'; // Dashboard-specific TopBar
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';

// Import Pages (Auth, Dashboard, Landing)
import { Home } from './pages/landing/Home';
import { AboutUs } from './pages/landing/AboutUs';
import { PrivacyPolicy } from './pages/landing/PrivacyPolicy';
import { Support } from './pages/landing/Support';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { MyVehicles } from './pages/dashboard/MyVehicles';
import { RegisterVehicle } from './pages/dashboard/RegisterVehicle';
import { TransferVehicle } from './pages/dashboard/TransferVehicle';
import { ApplicationStatus } from './pages/dashboard/ApplicationStatus';
import { Settings } from './pages/dashboard/Settings';
import { NotFound } from './pages/landing/NotFound';

import './i18n/i18n'; // If needed for internationalization

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
          }} 
        />

        {/* Main Route Layout */}
        <Routes>
          {/* Dashboard Layout Route (Sidebar, Dashboard TopBar) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<RegisterVehicle />} />
            <Route path="/transfer" element={<TransferVehicle />} />
            <Route path="/my-vehicles" element={<MyVehicles />} />
            <Route path="/status" element={<ApplicationStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Auth Pages (Login, Register) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Landing Pages Layout (Home, About, etc.) */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* Catch-all for Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// Dashboard Layout
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBarDashboard />
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<RegisterVehicle />} />
            <Route path="/transfer" element={<TransferVehicle />} />
            <Route path="/my-vehicles" element={<MyVehicles />} />
            <Route path="/status" element={<ApplicationStatus />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}

// Auth Layout
const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainTopBar />
      <main className="flex-1 overflow-auto p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

// Landing Layout
const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MainTopBar />
      <Navigation />
      <main className="flex-1 overflow-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
