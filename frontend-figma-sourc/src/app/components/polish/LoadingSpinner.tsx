import React from 'react';
import { LapyaLogo } from '../LapyaLogo';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner = ({ fullScreen = false, message }: LoadingSpinnerProps) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
        <LapyaLogo size={48} onDark={fullScreen} />
      </div>

      {/* Spinner Ring */}
      <div
        className="relative"
        style={{
          width: '48px',
          height: '48px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(61, 107, 229, 0.2)',
            borderTopColor: '#3D6BE5',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9375rem',
          color: fullScreen ? '#A8BCF0' : '#5E6680',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {message}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1E2A5E' }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
};
