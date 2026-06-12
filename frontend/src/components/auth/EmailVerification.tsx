import React, { useEffect, useRef, useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Container from '../layout/Container';

interface EmailVerificationProps {
  email: string;
  onVerified: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  isVerifying?: boolean;
}

const CODE_LENGTH = 6;

export const EmailVerification = ({ email, onVerified, onResend, isVerifying = false }: EmailVerificationProps) => {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join('');
  const isComplete = code.length === CODE_LENGTH && digits.every((d) => d !== '');

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }
    // Support pasting the whole code into any box.
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < cleaned.length && index + i < CODE_LENGTH; i += 1) {
        next[index + i] = cleaned[i];
      }
      return next;
    });
    const focusTo = Math.min(index + cleaned.length, CODE_LENGTH - 1);
    inputsRef.current[focusTo]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    try {
      await onVerified(code);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not verify email.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await onResend?.();
      toast.success('New code sent. Check your inbox.');
      setResendCooldown(60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
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
              Enter your code
            </h1>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              lineHeight: 1.6,
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: '#1E2A5E' }}>{email}</strong>.
              <br />
              Check your spam folder if you don't see it.
            </p>

            {/* Code boxes */}
            <div className="flex gap-2 mb-8 justify-center">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={CODE_LENGTH}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 rounded-xl text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `2px solid ${digit ? '#3D6BE5' : '#E7E4DD'}`,
                    color: '#1E2A5E',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isComplete || isVerifying}
              className="w-full py-4 rounded-xl mb-4"
              style={{
                backgroundColor: isComplete && !isVerifying ? '#3D6BE5' : '#E7E4DD',
                color: isComplete && !isVerifying ? '#FFFFFF' : '#5E6680',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                border: 'none',
                cursor: isComplete && !isVerifying ? 'pointer' : 'not-allowed',
                boxShadow: isComplete && !isVerifying ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
              }}
            >
              {isVerifying ? 'Verifying…' : 'Verify email'}
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                color: (isResending || resendCooldown > 0) ? '#5E6680' : '#3D6BE5',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                border: 'none',
                cursor: (isResending || resendCooldown > 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {isResending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Sending…
                </>
              ) : resendCooldown > 0 ? (
                `Resend code in ${resendCooldown}s`
              ) : (
                'Resend code'
              )}
            </button>
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
