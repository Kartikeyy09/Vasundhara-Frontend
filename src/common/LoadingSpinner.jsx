// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({
    size = 'md',
    fullScreen = false,
    text = 'Loading...',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
    };

    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
                style={{ borderStyle: 'solid' }}
            />
            {text && (
                <p className={`text-gray-600 ${textSizes[size]} font-medium`}>{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;