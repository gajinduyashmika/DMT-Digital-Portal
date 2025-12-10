import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CustomToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const CustomToast = ({ type, message, onClose, duration = 5000 }: CustomToastProps) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const configs = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      progressColor: 'bg-green-500',
      icon: CheckCircle,
      title: t('toast_success_title') || 'Success'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      progressColor: 'bg-red-500',
      icon: AlertCircle,
      title: t('toast_error_title') || 'Error'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      progressColor: 'bg-blue-500',
      icon: Info,
      title: t('toast_info_title') || 'Info'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      progressColor: 'bg-yellow-500',
      icon: AlertTriangle,
      title: t('toast_warning_title') || 'Warning'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`relative min-w-[350px] max-w-md rounded-lg shadow-lg border-l-4 ${config.borderColor} ${config.bgColor} p-4 animate-in slide-in-from-right duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`${config.iconColor} mt-0.5`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{config.title}</h3>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X size={20} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
