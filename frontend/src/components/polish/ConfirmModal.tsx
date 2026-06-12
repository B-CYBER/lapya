import React from 'react';
import { AlertCircle, Trash2, LogOut, X } from 'lucide-react';

interface ConfirmModalProps {
  type: 'delete' | 'logout' | 'warning';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  type,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmModalProps) => {
  const icons = {
    delete: Trash2,
    logout: LogOut,
    warning: AlertCircle
  };

  const colors = {
    delete: '#B4533A',
    logout: '#C9892E',
    warning: '#C9892E'
  };

  const Icon = icons[type];
  const iconColor = colors[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(30, 42, 94, 0.6)' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon size={28} style={{ color: iconColor }} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E',
          marginBottom: '0.75rem',
          textAlign: 'center'
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9375rem',
          color: '#5E6680',
          lineHeight: 1.6,
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: iconColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>

          <button
            onClick={onCancel}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid #E7E4DD',
              color: '#1E2A5E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
