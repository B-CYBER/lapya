import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface SignupScreenProps {
  onBack: () => void;
  onSignup: (data: { email: string; password: string; firstName: string; lastName: string }) => void;
  onOpenLogin?: () => void;
}

export const SignupScreen = ({ onBack, onSignup, onOpenLogin }: SignupScreenProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSignup({ email, password, firstName, lastName });
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
              Create your account
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              marginBottom: '2rem'
            }}>
              Start your journey to better health
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col">
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1">
              <label style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1E2A5E',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ngozi"
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

            <div className="flex-1">
              <label style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1E2A5E',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Okafor"
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
          </div>

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
              Email address
            </label>
            <input
              type="email"
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
          <div className="mb-6">
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
                placeholder="At least 6 characters"
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
            {password.length > 0 && password.length < 6 && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#C9892E',
                marginTop: '0.5rem'
              }}>
                Password must be at least 6 characters
              </p>
            )}
          </div>

              {/* Terms */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#5E6680',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}>
                By creating an account, you agree to our{' '}
                <span style={{ color: '#3D6BE5', fontWeight: 500 }}>Terms of Service</span>
                {' '}and{' '}
                <span style={{ color: '#3D6BE5', fontWeight: 500 }}>Privacy Policy</span>.
              </p>

              {/* Create Account Button */}
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
                Create account
              </button>

              {/* Login Link */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#5E6680',
                textAlign: 'center'
              }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onOpenLogin}
                  style={{
                    color: '#3D6BE5',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
};
