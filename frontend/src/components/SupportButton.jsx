import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SupportButton = ({ context, className, label = 'Get Support', variant = 'default' }) => {
    const { openSupport, isDarkMode } = useStore();

    const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm";

    // Variant styles
    const variants = {
        default: isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700",
        outline: isDarkMode
            ? "border border-gray-700 hover:bg-gray-800 text-gray-300"
            : "border border-gray-300 hover:bg-gray-50 text-gray-700",
        ghost: isDarkMode
            ? "hover:bg-white/10 text-gray-400 hover:text-white"
            : "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
    };

    const style = `${baseStyles} ${variants[variant] || variants.default} ${className || ''}`;

    return (
        <button
            onClick={() => {
                console.log('SupportButton clicked with context:', context);
                openSupport(context);
            }}
            className={style}
            type="button"
        >
            <HelpCircle className="w-4 h-4" />
            {label}
        </button>
    );
};
