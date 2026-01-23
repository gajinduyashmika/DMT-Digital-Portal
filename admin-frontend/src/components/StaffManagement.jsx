import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Eye,
    UserX,
    UserCheck,
    RotateCcw,
    Edit,
    MapPin,
    Calendar,
    Shield,
    Phone,
    Mail,
    Activity,
    Clock,
    X,
    Download,
    AlertTriangle,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

const roleOptions = [
    { value: 'super_admin', label: 'Super Administrator' },
    { value: 'registration_officer', label: 'Registration Officer' },
    { value: 'ownership_officer', label: 'Ownership Officer' },
    { value: 'document_verifier', label: 'Document Verifier' },
    { value: 'communication_admin', label: 'Communication Admin' },
    { value: 'auditor', label: 'Auditor' }
];

export default function StaffManagement() {
    const { token, user } = useAuth();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [newStaffData, setNewStaffData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'registration_officer',
        department: '',
        nic: ''
    });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') {
                params.isActive = statusFilter === 'active' ? 'true' : 'false';
            }
            if (roleFilter !== 'all') {
                params.role = roleFilter;
            }

            const response = await axios.get(`${API_URL}/admin/staff`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setStaff(response.data.staff || []);
            setError('');
        } catch (err) {
            console.error('Error fetching staff:', err);
            if (err.response?.status === 403) {
                setError('Access denied. Only super admins can view staff.');
            } else {
                setError('Failed to load staff members');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStaff();
        }
    }, [token, statusFilter, roleFilter]);

    const getStatusColor = (isActive) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusIcon = (isActive) => {
        return isActive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />;
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'super_admin': return 'bg-purple-100 text-purple-800';
            case 'registration_officer': return 'bg-blue-100 text-blue-800';
            case 'ownership_officer': return 'bg-indigo-100 text-indigo-800';
            case 'document_verifier': return 'bg-orange-100 text-orange-800';
            case 'communication_admin': return 'bg-teal-100 text-teal-800';
            case 'auditor': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredStaff = staff.filter(s => {
        const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            await axios.post(
                `${API_URL}/admin/staff`,
                newStaffData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowAddForm(false);
            setNewStaffData({
                name: '',
                email: '',
                password: '',
                role: 'registration_officer',
                department: '',
                nic: ''
            });
            fetchStaff();
        } catch (err) {
            console.error('Error adding staff:', err);
            setError(err.response?.data?.message || 'Failed to add staff member');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async (staffId, currentStatus) => {
        try {
            setActionLoading(true);
            await axios.put(
                `${API_URL}/admin/staff/${staffId}`,
                { isActive: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStaff(prev => prev.map(s =>
                s._id === staffId ? { ...s, isActive: !currentStatus } : s
            ));

            if (selectedStaff?._id === staffId) {
                setSelectedStaff({ ...selectedStaff, isActive: !currentStatus });
            }
        } catch (err) {
            console.error('Error updating staff status:', err);
            setError('Failed to update staff status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async (staffId) => {
        const newPassword = prompt('Enter new password for this staff member:');
        if (!newPassword) return;

        try {
            setActionLoading(true);
            await axios.put(
                `${API_URL}/admin/staff/${staffId}/reset-password`,
                { newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Password reset successfully');
        } catch (err) {
            console.error('Error resetting password:', err);
            setError('Failed to reset password');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            setActionLoading(true);
            await axios.delete(
                `${API_URL}/admin/staff/${staffId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStaff(prev => prev.filter(s => s._id !== staffId));
            if (selectedStaff?._id === staffId) {
                setSelectedStaff(null);
            }
        } catch (err) {
            console.error('Error deleting staff:', err);
            setError('Failed to delete staff member');
        } finally {
            setActionLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewStaffData(prev => ({ ...prev, password }));
    };

    // Check if current user is super_admin
    const isSuperAdmin = user?.role === 'super_admin';

    if (!isSuperAdmin) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Access Restricted</h2>
                    <p className="text-gray-500 mt-2">Only Super Administrators can manage staff members.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchStaff}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Staff</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            {roleOptions.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No staff members found
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Staff Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStaff.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {s.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{s.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        {s.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(s.role)} mb-2`}>
                                                {roleOptions.find(r => r.value === s.role)?.label || s.role}
                                            </span>
                                            {s.department && (
                                                <div className="text-sm text-gray-500">{s.department}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(s.isActive)}`}>
                                                {getStatusIcon(s.isActive)}
                                                <span className="ml-1">{s.isActive ? 'Active' : 'Inactive'}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString() : 'Never'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Joined: {new Date(s.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedStaff(s)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Profile"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(s._id)}
                                                    disabled={actionLoading}
                                                    className="text-orange-600 hover:text-orange-900 p-1 rounded disabled:opacity-50"
                                                    title="Reset Password"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(s._id, s.isActive)}
                                                    disabled={actionLoading}
                                                    className={`p-1 rounded disabled:opacity-50 ${s.isActive
                                                            ? 'text-red-600 hover:text-red-900'
                                                            : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    title={s.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {s.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Staff Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <form onSubmit={handleAddStaff} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Add New Staff Member</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStaffData.name}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newStaffData.email}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="user@dmt.gov.lk"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                                    <input
                                        type="text"
                                        value={newStaffData.nic}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, nic: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="NIC number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={newStaffData.department}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, department: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Department name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={newStaffData.role}
                                        onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {roleOptions.map(role => (
                                            <option key={role.value} value={role.value}>{role.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            required
                                            value={newStaffData.password}
                                            onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Adding...' : 'Add Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Staff Profile Modal */}
            {selectedStaff && !showEditForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Staff Profile - {selectedStaff.name}</h3>
                            <button
                                onClick={() => setSelectedStaff(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-medium text-blue-700">
                                            {selectedStaff.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ST'}
                                        </span>
                                    </div>
                                </div>
                                <p><span className="font-medium">Full Name:</span> {selectedStaff.name}</p>
                                <p><span className="font-medium">Email:</span> {selectedStaff.email}</p>
                                {selectedStaff.nic && <p><span className="font-medium">NIC:</span> {selectedStaff.nic}</p>}
                                {selectedStaff.department && <p><span className="font-medium">Department:</span> {selectedStaff.department}</p>}
                                <p><span className="font-medium">Role:</span>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedStaff.role)}`}>
                                        {roleOptions.find(r => r.value === selectedStaff.role)?.label || selectedStaff.role}
                                    </span>
                                </p>
                                <p><span className="font-medium">Status:</span>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStaff.isActive)}`}>
                                        {selectedStaff.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                                <p><span className="font-medium">Join Date:</span> {new Date(selectedStaff.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-medium">Last Login:</span> {selectedStaff.lastLogin ? new Date(selectedStaff.lastLogin).toLocaleString() : 'Never'}</p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    onClick={() => handleToggleStatus(selectedStaff._id, selectedStaff.isActive)}
                                    disabled={actionLoading}
                                    className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${selectedStaff.isActive
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    {selectedStaff.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => setSelectedStaff(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
