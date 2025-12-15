import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const toastTypes = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-l-green-500',
        iconColor: 'text-green-500',
        textColor: 'text-green-800',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-l-red-500',
        iconColor: 'text-red-500',
        textColor: 'text-red-800',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-l-yellow-500',
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-800',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-l-blue-500',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800',
    },
};

const Toast = ({ type = 'info', message, onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);
    const config = toastTypes[type] || toastTypes.info;
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${config.bgColor
                } ${config.borderColor} ${isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
                }`}
        >
            <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
            <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
            <button
                onClick={handleClose}
                className={`p-1 rounded-full hover:bg-black/10 transition-colors ${config.textColor}`}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;