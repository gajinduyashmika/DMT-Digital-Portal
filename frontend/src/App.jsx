import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n/i18n'; // If needed for internationalization
import { ToastProvider } from './components/ToastContainer';
import { useStore } from './store/useStore';

// Import Layouts and Components
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { TopBarDashboard } from './components/TopBarDashboard'; // Dashboard-specific TopBar
import { Sidebar } from './components/Sidebar';
// import TicketButton from './components/TicketButton';
import { ChatWidget } from './components/ChatWidget'; // Import ChatWidget

// ... (existing imports)

// ... (App component)


import { Home } from './pages/landing/Home';
import { AboutUs } from './pages/landing/AboutUs';
import { PrivacyPolicy } from './pages/landing/PrivacyPolicy';
import { Support } from './pages/landing/Support';
import { VehicleSearch } from './pages/landing/VehicleSearch';
import { VehicleInfo } from './pages/landing/VehicleInfo';
import { VerificationPage } from './pages/landing/VerificationPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { MyVehicles } from './pages/dashboard/MyVehicles';
import { RegisterVehicle } from './pages/dashboard/RegisterVehicle';
import { TransferRequests } from './pages/dashboard/TransferRequests';
import { ApplicationStatus } from './pages/dashboard/ApplicationStatus';
import { Settings } from './pages/dashboard/Settings';
import { Notifications } from './pages/dashboard/Notifications';
import { NotFound } from './pages/landing/NotFound';

import axios from 'axios';

const App = () => {
    const { isDarkMode, initializeUser } = useStore();

    useEffect(() => {
        initializeUser();
    }, [initializeUser]);

    useEffect(() => {
        // Global Axios Interceptor for 401 Unauthorized
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // console.warn('Session expired. Redirecting to login...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <ToastProvider>
            <Router>
                <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
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
                            <Route path="/register-vehicle" element={<RegisterVehicle />} />
                            <Route path="/transfer-requests" element={<TransferRequests />} />
                            <Route path="/my-vehicles" element={<MyVehicles />} />
                            <Route path="/status" element={<ApplicationStatus />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/notifications" element={<Notifications />} />
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
                            <Route path="/check-details" element={<VehicleSearch />} />
                            <Route path="/vehicleinfo/:regNumber" element={<VehicleInfo />} />
                            <Route path="/verify/:regNumber" element={<VerificationPage />} />
                        </Route>

                        {/* Catch-all for Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </ToastProvider>
    );
}

export default App;

// Dashboard Layout
const DashboardLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    // const handleNavigateToTickets = () => {
    //     navigate('/tickets');
    // };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBarDashboard />
                <main className="flex-1 overflow-auto p-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                    <Outlet />
                </main>
            </div>
            <ChatWidget />
        </div>
    );
}

// Auth Layout
const AuthLayout = () => {
    const { isDarkMode } = useStore();
    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <Navigation />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

// Landing Layout
const LandingLayout = () => {
    const { isDarkMode } = useStore();
    return (
        <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <Navigation />
            {/* Main content with top padding for fixed nav */}
            <main className="flex-1 pt-[72px]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
