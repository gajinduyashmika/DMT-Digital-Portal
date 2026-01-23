import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext(undefined);

const rolePermissions = {
    super_admin: ['*'],
    registration_officer: ['vehicles.view', 'vehicles.approve', 'documents.verify', 'applications.view', 'applications.approve'],
    ownership_officer: ['transfers.view', 'transfers.approve', 'certificates.generate'],
    document_verifier: ['documents.view', 'documents.verify', 'ocr.use'],
    communication_admin: ['chat.manage', 'announcements.create', 'notifications.send', 'tickets.manage'],
    auditor: ['logs.view', 'reports.view']
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedToken = localStorage.getItem('dmt_admin_token');
        const savedUser = localStorage.getItem('dmt_admin_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));

            // Verify token is still valid
            axios.get(`${API_URL}/admin/auth/me`, {
                headers: { Authorization: `Bearer ${savedToken}` }
            }).then(response => {
                setUser(response.data);
                localStorage.setItem('dmt_admin_user', JSON.stringify(response.data));
            }).catch(() => {
                // Token invalid, clear session
                localStorage.removeItem('dmt_admin_token');
                localStorage.removeItem('dmt_admin_user');
                setToken(null);
                setUser(null);
            });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/admin/auth/login`, { email, password });

            const { token: newToken, admin } = response.data;

            setToken(newToken);
            setUser(admin);
            localStorage.setItem('dmt_admin_token', newToken);
            localStorage.setItem('dmt_admin_user', JSON.stringify(admin));

            setLoading(false);
            return true;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            setLoading(false);
            return false;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_URL}/admin/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            // Ignore logout errors
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem('dmt_admin_token');
        localStorage.removeItem('dmt_admin_user');
    };

    const hasPermission = (permission) => {
        if (!user) return false;

        const userPermissions = rolePermissions[user.role] || [];
        return userPermissions.includes('*') || userPermissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user && !!token,
            hasPermission,
            loading,
            token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
