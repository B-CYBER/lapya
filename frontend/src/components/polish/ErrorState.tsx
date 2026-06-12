import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message,
  showRetry = true,
  showHome = false,
  onRetry,
  onGoHome
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16">
      {/* Error Icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'rgba(180, 83, 58, 0.12)',
          border: '2px solid rgba(180, 83, 58, 0.3)'
        }}
      >
        <AlertCircle size={40} style={{ color: '#B4533A' }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#1E2A5E',
        marginBottom: '0.5rem',
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
        marginBottom: '1.5rem',
        maxWidth: '280px'
      }}>
        {message}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all"
            style={{
              backgroundColor: '#3D6BE5',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(61, 107, 229, 0.2)'
            }}
          >
            <RefreshCw size={18} />
            Try again
          </button>
        )}

        {showHome && onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid #E7E4DD',
              color: '#1E2A5E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Home size={18} />
            Go home
          </button>
        )}
      </div>
    </div>
  );
};
