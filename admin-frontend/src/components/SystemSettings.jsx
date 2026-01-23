import React, { useState, useEffect } from 'react';
import {
    Save,
    TestTube,
    Upload,
    Globe,
    Mail,
    Smartphone,
    Shield,
    Clock,
    AlertTriangle,
    CheckCircle,
    Settings,
    FileText,
    MessageCircle,
    Scan,
    Bell,
    Wrench,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function SystemSettings() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [settings, setSettings] = useState({
        modules: {
            liveChat: true,
            ocr: true,
            announcements: true,
            smsNotifications: false,
            documentVerification: true,
            ownershipTransfer: true
        },
        email: {
            smtpHost: 'smtp.gov.lk',
            smtpPort: 587,
            username: 'noreply@dmt.gov.lk',
            encryption: 'tls',
            testEmail: ''
        },
        fileUpload: {
            maxFileSize: 10,
            allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxDocumentsPerApplication: 10
        },
        multilingual: {
            enableSinhala: true,
            enableTamil: true,
            enableEnglish: true,
            defaultLanguage: 'english'
        },
        certificate: {
            headerText: 'Department of Motor Traffic - Sri Lanka',
            footerText: 'This is an official government document',
            enableWatermark: true,
            signatoryName: 'Commissioner of Motor Traffic',
            signatoryTitle: 'Commissioner'
        },
        maintenance: {
            enabled: false,
            message: 'The system is currently under maintenance. Please try again later.',
            scheduledStart: '',
            scheduledEnd: ''
        },
        security: {
            sessionTimeout: 30,
            forcePasswordReset: 90,
            enable2FA: false,
            maxLoginAttempts: 5
        },
        support: {
            hours: '8:00 AM - 5:00 PM (Monday to Friday)',
            phone: '+94-11-2691691',
            email: 'support@dmt.gov.lk',
            address: 'Department of Motor Traffic, Werahera, Boralesgamuwa'
        }
    });

    const [testResults, setTestResults] = useState({
        email: null,
        sms: null
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.settings) {
                const s = response.data.settings;
                setSettings(prev => ({
                    modules: { ...prev.modules, ...s.modules },
                    email: { ...prev.email, ...s.email },
                    fileUpload: { ...prev.fileUpload, ...s.fileUpload },
                    multilingual: { ...prev.multilingual, ...s.multilingual },
                    certificate: { ...prev.certificate, ...s.certificate },
                    maintenance: {
                        ...prev.maintenance,
                        ...s.maintenance,
                        scheduledStart: s.maintenance?.scheduledStart ? new Date(s.maintenance.scheduledStart).toISOString().slice(0, 16) : '',
                        scheduledEnd: s.maintenance?.scheduledEnd ? new Date(s.maintenance.scheduledEnd).toISOString().slice(0, 16) : ''
                    },
                    security: { ...prev.security, ...s.security },
                    support: { ...prev.support, ...s.support }
                }));
            }
            setError('');
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSettings();
        }
    }, [token]);

    const handleModuleToggle = async (module) => {
        try {
            const newValue = !settings.modules[module];

            await axios.put(`${API_URL}/admin/settings/modules/${module}`,
                { enabled: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSettings(prev => ({
                ...prev,
                modules: {
                    ...prev.modules,
                    [module]: newValue
                }
            }));

            setSuccessMessage(`Module ${module} ${newValue ? 'enabled' : 'disabled'}`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error toggling module:', err);
            setError('Failed to update module');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEmailTest = async () => {
        if (!settings.email.testEmail) {
            setError('Please enter a test email address');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setTestResults(prev => ({ ...prev, email: 'testing' }));

        try {
            const response = await axios.post(`${API_URL}/admin/settings/test-email`,
                { testEmail: settings.email.testEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTestResults(prev => ({ ...prev, email: 'success' }));
            setSuccessMessage(response.data.message);
            setTimeout(() => {
                setSuccessMessage('');
                setTestResults(prev => ({ ...prev, email: null }));
            }, 3000);
        } catch (err) {
            setTestResults(prev => ({ ...prev, email: 'error' }));
            setError('Failed to send test email');
            setTimeout(() => {
                setError('');
                setTestResults(prev => ({ ...prev, email: null }));
            }, 3000);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            await axios.put(`${API_URL}/admin/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMessage('Settings saved successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Failed to save settings');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const getTestResultIcon = (result) => {
        switch (result) {
            case 'testing': return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
            case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchSettings}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Module Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        Module Settings
                    </h3>
                    <div className="space-y-4">
                        {[
                            { key: 'liveChat', label: 'Live Chat Support', icon: MessageCircle },
                            { key: 'ocr', label: 'OCR Processing', icon: Scan },
                            { key: 'announcements', label: 'Announcements System', icon: Bell },
                            { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                            { key: 'documentVerification', label: 'Document Verification', icon: FileText },
                            { key: 'ownershipTransfer', label: 'Ownership Transfer', icon: Shield }
                        ].map(({ key, label, icon: Icon }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <Icon className="h-5 w-5 text-gray-600 mr-3" />
                                    <span className="text-sm font-medium text-gray-900">{label}</span>
                                </div>
                                <button
                                    onClick={() => handleModuleToggle(key)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.modules[key] ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.modules[key] ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email Configuration */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Email Configuration
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                            <input
                                type="text"
                                value={settings.email.smtpHost}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    email: { ...prev.email, smtpHost: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                                <input
                                    type="number"
                                    value={settings.email.smtpPort}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                                <select
                                    value={settings.email.encryption}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        email: { ...prev.email, encryption: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="tls">TLS</option>
                                    <option value="ssl">SSL</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="email"
                                value={settings.email.username}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    email: { ...prev.email, username: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Test email address"
                                value={settings.email.testEmail}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    email: { ...prev.email, testEmail: e.target.value }
                                }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleEmailTest}
                                disabled={testResults.email === 'testing'}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                            >
                                {getTestResultIcon(testResults.email) || <TestTube className="h-4 w-4" />}
                                <span>Test</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* File Upload Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Upload className="h-5 w-5 mr-2" />
                        File Upload Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max File Size (MB)
                            </label>
                            <input
                                type="number"
                                value={settings.fileUpload.maxFileSize}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    fileUpload: { ...prev.fileUpload, maxFileSize: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Allowed File Types
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'].map(type => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={settings.fileUpload.allowedTypes.includes(type)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSettings(prev => ({
                                                        ...prev,
                                                        fileUpload: {
                                                            ...prev.fileUpload,
                                                            allowedTypes: [...prev.fileUpload.allowedTypes, type]
                                                        }
                                                    }));
                                                } else {
                                                    setSettings(prev => ({
                                                        ...prev,
                                                        fileUpload: {
                                                            ...prev.fileUpload,
                                                            allowedTypes: prev.fileUpload.allowedTypes.filter(t => t !== type)
                                                        }
                                                    }));
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 uppercase">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Documents per Application
                            </label>
                            <input
                                type="number"
                                value={settings.fileUpload.maxDocumentsPerApplication}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    fileUpload: { ...prev.fileUpload, maxDocumentsPerApplication: parseInt(e.target.value) }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Multilingual Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Multilingual Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enabled Languages
                            </label>
                            <div className="space-y-2">
                                {[
                                    { key: 'enableEnglish', label: 'English' },
                                    { key: 'enableSinhala', label: 'Sinhala (සිංහල)' },
                                    { key: 'enableTamil', label: 'Tamil (தமிழ்)' }
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={settings.multilingual[key]}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                multilingual: { ...prev.multilingual, [key]: e.target.checked }
                                            }))}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Default Language
                            </label>
                            <select
                                value={settings.multilingual.defaultLanguage}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    multilingual: { ...prev.multilingual, defaultLanguage: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="english">English</option>
                                <option value="sinhala">Sinhala</option>
                                <option value="tamil">Tamil</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Certificate Template */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Certificate Template
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
                            <input
                                type="text"
                                value={settings.certificate.headerText}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    certificate: { ...prev.certificate, headerText: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                            <input
                                type="text"
                                value={settings.certificate.footerText}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    certificate: { ...prev.certificate, footerText: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Name</label>
                                <input
                                    type="text"
                                    value={settings.certificate.signatoryName}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        certificate: { ...prev.certificate, signatoryName: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Title</label>
                                <input
                                    type="text"
                                    value={settings.certificate.signatoryTitle}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        certificate: { ...prev.certificate, signatoryTitle: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.certificate.enableWatermark}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    certificate: { ...prev.certificate, enableWatermark: e.target.checked }
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable Watermark</span>
                        </label>
                    </div>
                </div>

                {/* Maintenance Mode */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Wrench className="h-5 w-5 mr-2" />
                        Maintenance Mode
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.maintenance.enabled}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    maintenance: { ...prev.maintenance, enabled: e.target.checked }
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
                        </label>
                        {settings.maintenance.enabled && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maintenance Message
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={settings.maintenance.message}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            maintenance: { ...prev.maintenance, message: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Scheduled Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={settings.maintenance.scheduledStart}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                maintenance: { ...prev.maintenance, scheduledStart: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Scheduled End
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={settings.maintenance.scheduledEnd}
                                            onChange={(e) => setSettings(prev => ({
                                                ...prev,
                                                maintenance: { ...prev.maintenance, scheduledEnd: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Support Information */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Support Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Hours</label>
                            <input
                                type="text"
                                value={settings.support.hours}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    support: { ...prev.support, hours: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={settings.support.phone}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        support: { ...prev.support, phone: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={settings.support.email}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        support: { ...prev.support, email: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                rows={2}
                                value={settings.support.address}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    support: { ...prev.support, address: e.target.value }
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
