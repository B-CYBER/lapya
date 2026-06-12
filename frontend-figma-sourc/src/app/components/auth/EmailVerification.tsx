import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import Container from '../layout/Container';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResend?: () => void;
}

export const EmailVerification = ({ email, onVerified, onResend }: EmailVerificationProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    onResend?.();

    setTimeout(() => {
      setIsResending(false);
      setResendCooldown(60);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <Container maxWidth="auth">
          <div className="flex flex-col items-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{
            backgroundColor: 'rgba(61, 107, 229, 0.12)',
            border: '2px solid rgba(61, 107, 229, 0.3)'
          }}
        >
          <Mail size={40} style={{ color: '#3D6BE5' }} />
        </div>

        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '1rem',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Verify your email
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9375rem',
          color: '#5E6680',
          lineHeight: 1.6,
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          We have sent a verification link to{' '}
          <strong style={{ color: '#1E2A5E' }}>{email}</strong>
        </p>

        <div
          className="w-full p-4 rounded-xl mb-6"
          style={{
            backgroundColor: 'rgba(61, 107, 229, 0.08)',
            border: '1px solid rgba(61, 107, 229, 0.2)'
          }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: '#1E2A5E',
            lineHeight: 1.6,
            marginBottom: '0.5rem'
          }}>
            📧 Check your email and click the verification link to continue.
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: '#5E6680',
            lineHeight: 1.6
          }}>
            Make sure to check your spam or junk folder if you do not see it in your inbox.
          </p>
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="w-full py-4 rounded-xl mb-4 flex items-center justify-center gap-2"
          style={{
            backgroundColor: (isResending || resendCooldown > 0) ? '#E7E4DD' : '#FFFFFF',
            color: (isResending || resendCooldown > 0) ? '#5E6680' : '#3D6BE5',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: `1.5px solid ${(isResending || resendCooldown > 0) ? '#E7E4DD' : '#3D6BE5'}`,
            cursor: (isResending || resendCooldown > 0) ? 'not-allowed' : 'pointer'
          }}
        >
          {isResending ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            `Resend in ${resendCooldown}s`
          ) : (
            <>
              <RefreshCw size={18} />
              Resend verification email
            </>
          )}
        </button>

        {/* Manual Verify Button (for demo) */}
        <button
          onClick={onVerified}
          className="w-full py-4 rounded-xl"
          style={{
            backgroundColor: '#3D6BE5',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(61, 107, 229, 0.2)'
          }}
        >
          I have verified my email
        </button>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#5E6680',
              marginTop: '1.5rem',
              textAlign: 'center',
              lineHeight: 1.6
            }}>
              Wrong email address? Contact support to update it.
            </p>
          </div>
        </Container>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
