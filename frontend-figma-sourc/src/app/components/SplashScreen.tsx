import React from 'react';
import { LapyaLogo } from './LapyaLogo';

export const SplashScreen = () => {
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#1E2A5E'
      }}
    >
      {/* Subtle blueberry pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueberries" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="#A8BCF0" opacity="0.3" />
              <circle cx="70" cy="50" r="18" fill="#A8BCF0" opacity="0.25" />
              <circle cx="40" cy="80" r="12" fill="#A8BCF0" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueberries)" />
        </svg>
      </div>

      {/* Logo */}
      <div className="animate-fade-in">
        <LapyaLogo size={96} onDark={true} />
      </div>

      {/* Wordmark */}
      <h1
        className="mt-6 animate-fade-in"
        style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#F4D27A',
          letterSpacing: '-0.02em'
        }}
      >
        Lapya
      </h1>

      {/* Tagline */}
      <p
        className="mt-3 animate-fade-in"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#A8BCF0',
          letterSpacing: '0.01em'
        }}
      >
        Eat well, even with everything.
      </p>
    </div>
  );
};
