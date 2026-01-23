import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CustomToast = ({ type, message, onClose, duration = 5000 }) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(100);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (duration / 100));
                if (newProgress <= 0) {
                    clearInterval(interval);
                    handleClose();
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const configs = {
        success: {
            gradient: 'from-green-500/20 to-emerald-500/20',
            borderColor: 'border-green-500/30',
            iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
            progressColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
            textColor: 'text-green-400',
            icon: CheckCircle,
            title: t('toast_success_title') || 'Success'
        },
        error: {
            gradient: 'from-red-500/20 to-rose-500/20',
            borderColor: 'border-red-500/30',
            iconBg: 'bg-gradient-to-br from-red-500 to-rose-500',
            progressColor: 'bg-gradient-to-r from-red-500 to-rose-500',
            textColor: 'text-red-400',
            icon: AlertCircle,
            title: t('toast_error_title') || 'Error'
        },
        info: {
            gradient: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'border-blue-500/30',
            iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            progressColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            textColor: 'text-blue-400',
            icon: Info,
            title: t('toast_info_title') || 'Info'
        },
        warning: {
            gradient: 'from-yellow-500/20 to-orange-500/20',
            borderColor: 'border-yellow-500/30',
            iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
            progressColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            textColor: 'text-yellow-400',
            icon: AlertTriangle,
            title: t('toast_warning_title') || 'Warning'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div
            className={`relative min-w-[380px] max-w-md overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-300 ${isExiting
                    ? 'opacity-0 translate-x-full scale-95'
                    : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right'
                }`}
        >
            {/* Glass background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80`} />
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl" />

            {/* Border glow */}
            <div className={`absolute inset-0 rounded-2xl border ${config.borderColor}`} />

            {/* Content */}
            <div className="relative p-4">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${config.textColor}`}>
                                {config.title}
                            </h3>
                            <Sparkles className={`w-3.5 h-3.5 ${config.textColor} opacity-60`} />
                        </div>
                        <p className="mt-1 text-sm text-gray-300 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        aria-label="Close notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                <div
                    className={`h-full ${config.progressColor} transition-all duration-100 ease-linear rounded-full`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
