import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VehicleRegistration from './components/VehicleRegistration';
import LiveChat from './components/LiveChat';
import Announcements from './components/Announcements';
import UserManagement from './components/UserManagement';
import NotificationManagement from './components/NotificationManagement';
import AuditLogs from './components/AuditLogs';
import SystemSettings from './components/SystemSettings';
import StaffManagement from './components/StaffManagement';
import OwnershipTransfers from './components/OwnershipTransfers';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vehicles" element={<VehicleRegistration />} />
                    <Route path="/transfers" element={<OwnershipTransfers />} />
                    <Route path="/documents" element={
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    OCR Settings
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow p-8">
                                <div className="text-center">
                                    <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">OCR-Powered Document Verification</h2>
                                    <p className="text-gray-600 mb-6">Advanced optical character recognition system for automated document processing and verification.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Pending Review</h3>
                                            <p className="text-2xl font-bold text-yellow-600">45</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Auto-Verified</h3>
                                            <p className="text-2xl font-bold text-green-600">127</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Manual Review</h3>
                                            <p className="text-2xl font-bold text-blue-600">18</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-2">Rejected</h3>
                                            <p className="text-2xl font-bold text-red-600">7</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    } />
                    <Route path="/chat" element={<LiveChat />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/notifications" element={<NotificationManagement />} />
                    <Route path="/logs" element={<AuditLogs />} />
                    <Route path="/settings" element={<SystemSettings />} />
                    <Route path="/staff" element={<StaffManagement />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                </Routes>
            </Layout>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

import axios from 'axios';

function App() {
    // Global Interceptor for 401 Unauthorized
    React.useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('dmt_admin_token');
                    localStorage.removeItem('dmt_admin_user');
                    // Force reload to clear context state and redirect via ProtectedRoute
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="App">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
