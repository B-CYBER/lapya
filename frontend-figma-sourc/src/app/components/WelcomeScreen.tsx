import React from 'react';

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onOpenLogin?: () => void;
}

export const WelcomeScreen = ({ onGetStarted, onOpenLogin }: WelcomeScreenProps) => {
  return (
    <div
      className="w-full h-screen flex flex-col md:flex-row relative overflow-hidden"
      style={{
        backgroundColor: '#FBFAF7'
      }}
    >
      {/* Hero Image Section - Top 60% on mobile, left 50% on desktop */}
      <div className="relative w-full md:w-1/2 md:h-screen" style={{ height: '60%' }}>
        {/* High-resolution editorial photograph */}
        <img
          src="https://images.unsplash.com/photo-1529832588601-c01e066263a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="African women sharing a meal together"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        />

        {/* Navy gradient overlay at bottom for text legibility */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '50%',
            background: 'linear-gradient(to top, rgba(30, 42, 94, 0.85) 0%, rgba(30, 42, 94, 0.4) 50%, transparent 100%)'
          }}
        />

        {/* Display headline */}
        <div className="absolute bottom-8 left-0 right-0 px-8 md:px-12">
          <h1
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#FBFAF7',
              lineHeight: 1.2,
              marginBottom: '0.75rem'
            }}
            className="md:text-5xl"
          >
            Eat well, even with everything.
          </h1>
        </div>
      </div>

      {/* Content Section - Bottom 40% on mobile, right 50% on desktop */}
      <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 pt-8 pb-8 md:justify-center md:w-1/2 md:max-w-xl md:mx-auto">
        {/* Sub-text */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 400,
            color: '#5E6680',
            lineHeight: 1.6
          }}
        >
          Personal meal plans for diabetes, blood pressure, kidney health and more — in the African foods you actually love.
        </p>

        {/* Spacer to push buttons down */}
        <div className="flex-1" />

        {/* Social Sign-up Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onGetStarted}
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
          </button>

          <button
            onClick={onGetStarted}
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
          </button>

          <button
            onClick={onGetStarted}
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
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: '#E7E4DD' }} />
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#5E6680'
          }}>
            or
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#E7E4DD' }} />
        </div>

        {/* Email Sign-up Button */}
        <button
          onClick={onGetStarted}
          className="w-full transition-all duration-200 active:scale-95"
          style={{
            backgroundColor: '#3D6BE5',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '1rem',
            borderRadius: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(30, 42, 94, 0.12)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2E5BD4';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 42, 94, 0.18)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3D6BE5';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 42, 94, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Continue with email
        </button>

        {/* Secondary link */}
        <button
          onClick={onOpenLogin}
          className="w-full mt-4 transition-opacity duration-200"
          style={{
            backgroundColor: 'transparent',
            color: '#3D6BE5',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 500,
            padding: '0.75rem',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          I already have an account
        </button>

        {/* Bottom microcopy */}
        <p
          className="text-center mt-6"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: '#5E6680',
            lineHeight: 1.5
          }}
        >
          By continuing you agree to our Terms & Privacy.
        </p>
      </div>
    </div>
  );
};
