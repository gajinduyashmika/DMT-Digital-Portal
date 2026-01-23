import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import axios from 'axios';
import { useToast } from '../../components/ToastContainer';
import {
    User,
    Mail,
    Lock,
    Bell,
    LogOut,
    Smartphone,
    Upload,
    Trash,
    Eye,
    EyeOff,
    Save,
} from 'lucide-react';

const translations = {
    en: {
        title: 'Settings',
        sections: {
            profile: 'Profile Settings',
            notifications: 'Notification Preferences',
            security: 'Security & Privacy',
            activity: 'Login Activity',
        },
        fields: {
            name: 'Full Name',
            email: 'Email Address',
            phone: 'Phone Number',
            nationalId: 'National ID',
            address: 'Address',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            language: 'Language',
        },
        notifications: {
            email: 'Email Notifications',
            sms: 'SMS Notifications',
            system: 'System Notifications',
        },
        buttons: {
            upload: 'Upload Photo',
            remove: 'Remove Photo',
            save: 'Save Changes',
            logout: 'Sign Out from All Devices',
            changePassword: 'Change Password',
        },
    },
    si: {
        title: 'සැකසුම්',
        sections: {
            profile: 'පැතිකඩ සැකසුම්',
            notifications: 'දැනුම්දීම් මනාප',
            security: 'ආරක්ෂාව සහ රහස්‍යතාව',
            activity: 'පිවිසුම් ක්‍රියාකාරකම්',
        },
        fields: {
            name: 'සම්පූර්ණ නම',
            email: 'විද්‍යුත් තැපෑල',
            phone: 'දුරකථන අංකය',
            nationalId: 'ජාතික හැඳුනුම්පත්',
            address: 'ලිපිනය',
            currentPassword: 'වර්තමාන මුරපදය',
            newPassword: 'නව මුරපදය',
            confirmPassword: 'මුරපදය තහවුරු කරන්න',
            language: 'භාෂාව',
        },
        notifications: {
            email: 'විද්‍යුත් තැපෑල දැනුම්දීම්',
            sms: 'කෙටි පණිවුඩ දැනුම්දීම්',
            system: 'පද්ධති දැනුම්දීම්',
        },
        buttons: {
            upload: 'ඡායාරූපය උඩුගත කරන්න',
            remove: 'ඡායාරූපය ඉවත් කරන්න',
            save: 'වෙනස්කම් සුරකින්න',
            logout: 'සියලු උපාංග වලින් ඉවත් වන්න',
            changePassword: 'මුරපදය වෙනස් කරන්න',
        },
    },
    ta: {
        title: 'அமைப்புகள்',
        sections: {
            profile: 'சுயவிவர அமைப்புகள்',
            notifications: 'அறிவிப்பு விருப்பங்கள்',
            security: 'பாதுகாப்பு & தனியுரிமை',
            activity: 'உள்நுழைவு செயல்பாடு',
        },
        fields: {
            name: 'முழு பெயர்',
            email: 'மின்னஞ்சல் முகவரி',
            phone: 'தொலைபேசி எண்',
            nationalId: 'தேசிய அடையாள எண்',
            address: 'முகவரி',
            currentPassword: 'தற்போதைய கடவுச்சொல்',
            newPassword: 'புதிய கடவுச்சொல்',
            confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
            language: 'மொழி',
        },
        notifications: {
            email: 'மின்னஞ்சல் அறிவிப்புகள்',
            sms: 'SMS அறிவிப்புகள்',
            system: 'கணினி அறிவிப்புகள்',
        },
        buttons: {
            upload: 'புகைப்படத்தை பதிவேற்றவும்',
            remove: 'புகைப்படத்தை அகற்று',
            save: 'மாற்றங்களை சேமி',
            logout: 'அனைத்து சாதனங்களிலிருந்தும் வெளியேறு',
            changePassword: 'கடவுச்சொல்லை மாற்று',
        },
    },
};

const loginActivity = [
    {
        id: 1,
        device: 'Chrome on Windows',
        ip: '192.168.1.1',
        timestamp: '2024-03-15 14:30',
        location: 'Colombo, Sri Lanka',
    },
    {
        id: 2,
        device: 'Safari on iPhone',
        ip: '192.168.1.2',
        timestamp: '2024-03-14 09:15',
        location: 'Kandy, Sri Lanka',
    },
];

export const Settings = () => {
    const { language, isDarkMode } = useStore();
    const { showToast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: true,
        system: true,
    });

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        nationalId: '',
    });

    const [originalData, setOriginalData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        nationalId: '',
        profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
    });

    const [isModified, setIsModified] = useState({
        profile: false,
        password: false,
    });

    const [profileImage, setProfileImage] = useState(
        'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
    );

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [loginHistory, setLoginHistory] = useState([]);

    // Fetch user data from MongoDB on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedEmail = localStorage.getItem('userEmail');
                if (!storedEmail) {
                    showToast('error', 'User email not found. Please login again.');
                    setLoading(false);
                    return;
                }

                setUserEmail(storedEmail);
                const userRes = await axios.get(`http://localhost:5000/api/auth/user/${storedEmail}`);
                const userData = userRes.data;

                setFormData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    nationalId: userData.nationalId || '',
                });

                setOriginalData({
                    fullName: userData.fullName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    nationalId: userData.nationalId || '',
                    profilePicture: userData.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
                });

                if (
                    userData.profilePicture &&
                    userData.profilePicture !== 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
                ) {
                    setProfileImage(userData.profilePicture);
                }

                // Fetch Login History
                axios.get(`http://localhost:5000/api/auth/login-history/${storedEmail}`)
                    .then(res => setLoginHistory(res.data))
                    .catch(err => console.error("Failed to load login history", err));

                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                showToast('error', 'Failed to load user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [showToast, isDarkMode]);

    const handleLogoutAll = async () => {
        if (!window.confirm("Are you sure you want to sign out from all devices? You will be redirected to login.")) return;

        try {
            setUpdating(true);
            await axios.post('http://localhost:5000/api/auth/logout-all', { email: userEmail });
            showToast('success', 'Signed out from all devices.');

            // Local logout
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('username');
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to sign out all devices');
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setIsModified(prev => ({ ...prev, profile: true }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value,
        }));
        setIsModified(prev => ({ ...prev, password: true }));
    };

    const handleImageUpload = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('error', 'Image size must be less than 2MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('error', 'Please upload a valid image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
                setIsModified(prev => ({ ...prev, profile: true }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            if (!userEmail) {
                showToast('error', 'User email not found');
                return;
            }

            setUpdating(true);
            const updateData = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
            };

            // Check if profile picture has changed
            if (profileImage && profileImage !== (originalData.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')) {
                updateData.profilePicture = profileImage;
            }

            await axios.put(`http://localhost:5000/api/auth/user/${userEmail}`, updateData);

            showToast('success', 'Profile updated successfully!');
            setOriginalData({
                ...formData,
                profilePicture: profileImage,
            });
            setIsModified(prev => ({ ...prev, profile: false }));
        } catch (err) {
            console.error('Error updating profile:', err);
            showToast('error', err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('error', 'New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            showToast('warning', 'Password must be at least 8 characters');
            return;
        }

        try {
            if (!userEmail) {
                showToast('error', 'User email not found');
                return;
            }

            setUpdating(true);
            await axios.put(`http://localhost:5000/api/auth/user/${userEmail}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            showToast('success', 'Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setIsModified(prev => ({ ...prev, password: false }));
        } catch (err) {
            console.error('Error updating password:', err);
            showToast('error', err.response?.data?.message || 'Failed to update password');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 mx-auto"></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Settings */}
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">{translations[language].sections.profile}</h2>
                    {isModified.profile && (
                        <button
                            onClick={handleProfileUpdate}
                            disabled={updating}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>{translations[language].buttons.save}</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="mb-6 flex items-center gap-6">
                    <div className="relative h-24 w-24">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className={`flex h-full w-full items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}
                            >
                                <User className="h-12 w-12 text-gray-400" />
                            </div>
                        )}
                        <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-red-600 p-2 text-white hover:bg-red-700">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <Upload className="h-4 w-4" />
                        </label>
                    </div>
                    {profileImage && (
                        <button
                            onClick={() => {
                                setProfileImage('https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg');
                                setIsModified(prev => ({ ...prev, profile: true }));
                            }}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                            <Trash className="h-4 w-4" />
                            <span>{translations[language].buttons.remove}</span>
                        </button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">{translations[language].fields.name}</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border px-4 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                }`}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">{translations[language].fields.email}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className={`w-full rounded-lg border px-4 py-2 opacity-60 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                }`}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">{translations[language].fields.phone}</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border px-4 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                }`}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">{translations[language].fields.nationalId}</label>
                        <input
                            type="text"
                            name="nationalId"
                            value={formData.nationalId}
                            disabled
                            className={`w-full rounded-lg border px-4 py-2 opacity-60 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                }`}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium">{translations[language].fields.address}</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border px-4 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                            }`}
                    />
                </div>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{translations[language].buttons.changePassword}</h3>
                        {isModified.password && (
                            <button
                                onClick={handlePasswordUpdate}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>{translations[language].buttons.save}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder={translations[language].fields.currentPassword}
                                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder={translations[language].fields.newPassword}
                                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder={translations[language].fields.confirmPassword}
                                className={`w-full rounded-lg border pl-10 pr-10 py-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
                                    }`}
                            />
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="mb-6 text-xl font-semibold">{translations[language].sections.notifications}</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{translations[language].notifications.email}</span>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-400" />
                            <span>{translations[language].notifications.sms}</span>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={notifications.sms}
                                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="h-5 w-5 text-gray-400" />
                            <span>{translations[language].notifications.system}</span>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={notifications.system}
                                onChange={(e) => setNotifications({ ...notifications, system: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Login Activity */}
            <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="mb-6 text-xl font-semibold">{translations[language].sections.activity}</h2>
                <div className="space-y-4">
                    {loginHistory.map((activity, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                }`}
                        >
                            <div>
                                <p className="font-medium">{activity.device}</p>
                                <p className="text-sm opacity-70">
                                    {activity.ip}
                                </p>
                            </div>
                            <p className="text-sm opacity-70">{new Date(activity.date).toLocaleString()}</p>
                        </div>
                    ))}
                    {loginHistory.length === 0 && (
                        <p className="text-sm opacity-70">No recent login activity.</p>
                    )}
                </div>
                <button
                    onClick={handleLogoutAll}
                    disabled={updating}
                    className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                    <LogOut className="h-4 w-4" />
                    <span>{translations[language].buttons.logout}</span>
                </button>
            </div>
        </div>
    );
};
