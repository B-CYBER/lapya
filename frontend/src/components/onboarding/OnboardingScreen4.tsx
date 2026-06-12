import React, { useState, useEffect } from 'react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface OnboardingScreen4Props {
  userName: string;
  conditions: string[];
  onComplete: () => void;
}

export const OnboardingScreen4 = ({ userName, conditions, onComplete }: OnboardingScreen4Props) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'Reading your health profile…',
    'Matching foods to your conditions…',
    'Calculating safe portions…',
    'Building your personalized plan…'
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);

    // Rotating messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#1E2A5E' }}
    >
      <Container maxWidth="auth">
      {/* Subtle blueberry pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueberries-onboarding" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="#A8BCF0" opacity="0.3" />
              <circle cx="70" cy="50" r="18" fill="#A8BCF0" opacity="0.25" />
              <circle cx="40" cy="80" r="12" fill="#A8BCF0" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueberries-onboarding)" />
        </svg>
      </div>

        {/* Animated logo with pulse */}
        <div className="mb-8 animate-pulse flex justify-center">
          <div className="relative">
            <LapyaLogo size={80} onDark={true} />

            {/* Periwinkle glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                backgroundColor: 'transparent',
                border: '3px solid #A8BCF0',
                opacity: 0.4
              }}
            />
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-center mb-6"
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '2rem',
            fontWeight: 600,
            color: '#F4D27A',
            lineHeight: 1.2
          }}
        >
          We're building your plan, {userName}…
        </h1>

        {/* Sub-text */}
        <p
          className="text-center mb-12"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: '#A8BCF0',
            lineHeight: 1.6
          }}
        >
          This takes about 5 seconds. We're balancing {conditions.join(', ')} using foods you love.
        </p>

        {/* Progress bar with shimmer */}
        <div className="w-full">
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
        >
          <div
            className="h-full rounded-full relative transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3D6BE5 0%, #E8A92E 50%, #3D6BE5 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }}
          />
        </div>

        {/* Rotating message */}
        <p
          className="text-center mt-6 transition-opacity duration-300"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: '#A8BCF0',
            minHeight: '1.5rem'
          }}
        >
          {messages[currentMessage]}
        </p>
        </div>
      </Container>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};
