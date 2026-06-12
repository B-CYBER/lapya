import React, { useState } from 'react';
import { ChevronLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Container from '../layout/Container';

interface ForgotPasswordProps {
  onBack: () => void;
  onRequest?: (email: string) => Promise<unknown>;
}

export const ForgotPassword = ({ onBack, onRequest }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (onRequest) {
        await onRequest(email);
      }
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
        {/* Back Button */}
        <div className="px-4 sm:px-6 py-5">
          <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center pb-8">
          <Container maxWidth="auth">
            <div className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  backgroundColor: 'rgba(110, 154, 110, 0.15)',
                  border: '2px solid rgba(110, 154, 110, 0.3)'
                }}
              >
                <CheckCircle size={40} style={{ color: '#6E9A6E' }} />
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
                Check your email
              </h1>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#5E6680',
                lineHeight: 1.6,
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                We have sent password reset instructions to{' '}
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
                  lineHeight: 1.6
                }}>
                  💡 Did not receive the email? Check your spam folder or try again with a different email address.
                </p>
              </div>

              <button
                onClick={onBack}
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
                Back to Login
              </button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Back Button */}
      <div className="px-4 sm:px-6 py-5">
        <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col pb-8 overflow-y-auto">
        <Container maxWidth="auth">
          <div
            className="rounded-3xl p-8"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 24px rgba(30, 42, 94, 0.08)'
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                backgroundColor: 'rgba(61, 107, 229, 0.12)',
                border: '1.5px solid rgba(61, 107, 229, 0.2)'
              }}
            >
              <Mail size={32} style={{ color: '#3D6BE5' }} />
            </div>

            <h1 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '2rem',
              fontWeight: 600,
              color: '#1E2A5E',
              marginBottom: '0.75rem',
              lineHeight: 1.2
            }}>
              Forgot password?
            </h1>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              lineHeight: 1.6,
              marginBottom: '2.5rem'
            }}>
              No worries! Enter your email address and we will send you instructions to reset your password.
            </p>

            {/* Email Input */}
            <div className="mb-6">
          <label style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1E2A5E',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3.5 rounded-xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E7E4DD',
              color: '#1E2A5E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3D6BE5';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E7E4DD';
            }}
          />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!email || isSubmitting}
              className="w-full py-4 rounded-xl mb-4"
              style={{
                backgroundColor: email && !isSubmitting ? '#3D6BE5' : '#E7E4DD',
                color: email && !isSubmitting ? '#FFFFFF' : '#5E6680',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                border: 'none',
                cursor: email && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: email && !isSubmitting ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
              }}
            >
              {isSubmitting ? 'Sending…' : 'Send reset instructions'}
            </button>

            {/* Back to Login */}
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              textAlign: 'center'
            }}>
              Remember your password?{' '}
              <button
                onClick={onBack}
                style={{
                  color: '#3D6BE5',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Back to login
              </button>
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
};
