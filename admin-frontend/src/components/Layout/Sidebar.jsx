import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    ArrowLeftRight,
    FileCheck,
    MessageCircle,
    Megaphone,
    Users,
    Bell,
    ScrollText,
    Settings,
    Shield,
    UserCog,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigationGroups = [
    {
        name: 'Overview',
        items: [
            { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard.view' },
        ]
    },
    {
        name: 'Operations',
        items: [
            { name: 'Vehicle Registration', href: '/vehicles', icon: Car, permission: 'vehicles.view' },
            { name: 'Ownership Transfers', href: '/transfers', icon: ArrowLeftRight, permission: 'transfers.view' },
            { name: 'Document Verification', href: '/documents', icon: FileCheck, permission: 'documents.view' },
        ]
    },
    {
        name: 'Communication',
        items: [
            { name: 'Live Chat', href: '/chat', icon: MessageCircle, permission: 'chat.manage' },
            { name: 'Announcements', href: '/announcements', icon: Megaphone, permission: 'announcements.create' },
            { name: 'Notifications', href: '/notifications', icon: Bell, permission: 'notifications.send' },
        ]
    },
    {
        name: 'Management',
        items: [
            { name: 'User Management', href: '/users', icon: Users, permission: 'users.manage' },
            { name: 'Staff Management', href: '/staff', icon: UserCog, permission: 'staff.manage' },
        ]
    },
    {
        name: 'System',
        items: [
            { name: 'Audit Logs', href: '/logs', icon: ScrollText, permission: 'logs.view' },
            { name: 'Settings', href: '/settings', icon: Settings, permission: 'settings.manage' },
        ]
    },
];

export default function Sidebar() {
    const { hasPermission, user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                {!isCollapsed && (
                    <div className="flex items-center space-x-3 animate-fade-in">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/30">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">DMT Digital Portal</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/30 mx-auto">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                {navigationGroups.map((group) => {
                    const visibleItems = group.items.filter(item => {
                        if (item.permission === 'staff.manage' && user?.role !== 'super_admin') {
                            return false;
                        }
                        return hasPermission(item.permission) || hasPermission('*') || user?.role === 'super_admin';
                    });

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.name}>
                            {!isCollapsed && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {group.name}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            } ${isCollapsed ? 'justify-center' : ''}`
                                        }
                                        title={isCollapsed ? item.name : ''}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <item.icon className={`flex-shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                                                    }`} />
                                                {!isCollapsed && (
                                                    <span className="animate-fade-in">{item.name}</span>
                                                )}
                                                {isActive && !isCollapsed && (
                                                    <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* User Profile & Collapse Button */}
            <div className="border-t border-gray-200">
                {/* User Profile */}
                <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    {!isCollapsed ? (
                        <div className="flex items-center space-x-3 animate-fade-in">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-sm font-bold text-white">
                                    {user?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.name || 'Admin User'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize truncate">
                                    {user?.role?.replace('_', ' ') || 'Administrator'}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer" title={user?.name}>
                            <span className="text-sm font-bold text-white">
                                {user?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={toggleSidebar}
                    className={`w-full p-3 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200`}
                    title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <>
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
