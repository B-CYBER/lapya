import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { LapyaLogo } from './LapyaLogo';
import Container from './layout/Container';

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (data: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  isSubmitting?: boolean;
}

export const LoginScreen = ({ onBack, onLogin, onForgotPassword, isSubmitting = false }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email.length > 0 && password.length > 0 && !isSubmitting;

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} sign-in is not available yet.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      void onLogin({ email, password });
    }
  };

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <LapyaLogo size={40} onDark={false} />
          </div>

          {/* Card Surface */}
          <div
            className="rounded-3xl p-8"
            style={{
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 24px rgba(30, 42, 94, 0.08)'
            }}
          >
            <h1 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '2rem',
              fontWeight: 600,
              color: '#1E2A5E',
              marginBottom: '0.5rem'
            }}>
              Welcome back
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              marginBottom: '2rem'
            }}>
              Sign in to continue your health journey
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Email Input */}
          <div className="mb-5">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Email or phone number
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3.5 rounded-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                color: '#1E2A5E',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
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

          {/* Password Input */}
          <div className="mb-4">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E7E4DD',
                  color: '#1E2A5E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3D6BE5';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E7E4DD';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#5E6680'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6">
            <button
              type="button"
              onClick={onForgotPassword}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#3D6BE5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E7E4DD' }} />
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#5E6680'
            }}>
              or continue with
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E7E4DD' }} />
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC04"/>
                <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
              </svg>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#1E2A5E'
              }}>
                Google
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" fill="#1877F2"/>
              </svg>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#1E2A5E'
              }}>
                Facebook
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.738 10.634c-.023-2.514 2.05-3.724 2.143-3.785-1.168-1.708-2.987-1.942-3.633-1.968-1.547-.156-3.018.911-3.803.911-.785 0-1.998-.888-3.283-.864-1.69.024-3.246.982-4.116 2.495-1.755 3.042-.449 7.551 1.261 10.021.837 1.21 1.834 2.568 3.145 2.52 1.287-.051 1.773-.833 3.328-.833 1.555 0 2.017.833 3.283.807 1.355-.024 2.235-1.234 3.072-2.444.967-1.398 1.366-2.751 1.39-2.82-.03-.014-2.666-1.023-2.687-4.04zm-2.466-7.286C15.09 2.378 15.83.938 15.686 0c-1.188.048-2.626.791-3.476 1.787-.762.882-1.43 2.29-1.25 3.644 1.322.102 2.67-.671 3.312-1.883z" fill="#000000"/>
              </svg>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#1E2A5E'
              }}>
                Apple
              </span>
            </button>
          </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-4 rounded-xl mb-4 transition-all"
                style={{
                  backgroundColor: isFormValid ? '#3D6BE5' : '#E7E4DD',
                  color: isFormValid ? '#FFFFFF' : '#5E6680',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  boxShadow: isFormValid ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
                }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>

              {/* Sign Up Link */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#5E6680',
                textAlign: 'center'
              }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    color: '#3D6BE5',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
};
