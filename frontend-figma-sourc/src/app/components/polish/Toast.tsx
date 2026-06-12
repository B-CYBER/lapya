import React, { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ type, message, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: Check,
      bgColor: '#6E9A6E',
      iconBg: 'rgba(110, 154, 110, 0.2)'
    },
    error: {
      icon: X,
      bgColor: '#B4533A',
      iconBg: 'rgba(180, 83, 58, 0.2)'
    },
    warning: {
      icon: AlertCircle,
      bgColor: '#C9892E',
      iconBg: 'rgba(201, 137, 46, 0.2)'
    },
    info: {
      icon: Info,
      bgColor: '#3D6BE5',
      iconBg: 'rgba(61, 107, 229, 0.2)'
    }
  };

  const { icon: Icon, bgColor, iconBg } = config[type];

  return (
    <div
      className="fixed top-20 left-0 right-0 mx-auto max-w-[358px] px-6 z-50"
      style={{
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div
        className="flex items-center gap-3 p-4 rounded-2xl"
        style={{
          backgroundColor: bgColor,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: '#FFFFFF' }} />
        </div>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: '#FFFFFF',
          lineHeight: 1.4,
          flex: 1
        }}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="p-1 flex-shrink-0"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#FFFFFF',
            opacity: 0.8
          }}
        >
          <X size={18} />
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
