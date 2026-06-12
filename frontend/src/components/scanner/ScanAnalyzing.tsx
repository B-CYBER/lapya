import React, { useState, useEffect } from 'react';

interface ScanAnalyzingProps {
  onComplete: () => void;
}

export const ScanAnalyzing = ({ onComplete }: ScanAnalyzingProps) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'Identifying ingredients…',
    'Checking your conditions…',
    'Calculating portions…'
  ];

  useEffect(() => {
    // Rotate messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1500);

    // Complete after 4.5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden px-8"
      style={{ backgroundColor: '#1E2A5E' }}
    >
      {/* Subtle blueberry pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueberries-scan" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="#A8BCF0" opacity="0.3" />
              <circle cx="70" cy="50" r="18" fill="#A8BCF0" opacity="0.25" />
              <circle cx="40" cy="80" r="12" fill="#A8BCF0" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueberries-scan)" />
        </svg>
      </div>

      {/* Captured Photo Thumbnail */}
      <div className="mb-8">
        <div
          className="w-20 h-20 rounded-full overflow-hidden"
          style={{
            border: '4px solid #3D6BE5',
            boxShadow: '0 8px 24px rgba(61, 107, 229, 0.3)'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=400&q=80"
            alt="Captured meal"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* AI Shimmer Animation */}
      <div className="mb-8 relative">
        <div className="flex items-center justify-center">
          {/* Dual ring spinner */}
          <div
            className="absolute w-24 h-24 rounded-full animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, #3D6BE5 0%, transparent 50%, #E8A92E 100%)',
              opacity: 0.6,
              animationDuration: '2s'
            }}
          />
          <div
            className="absolute w-20 h-20 rounded-full"
            style={{ backgroundColor: '#1E2A5E' }}
          />
        </div>
      </div>

      {/* Headline */}
      <h1
        className="text-center mb-12"
        style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#F4D27A',
          lineHeight: 1.2
        }}
      >
        Lapya is reading your plate…
      </h1>

      {/* Rotating Messages */}
      <div className="min-h-[3rem] flex items-center justify-center">
        <p
          className="text-center transition-opacity duration-300"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#A8BCF0',
            lineHeight: 1.6
          }}
        >
          {messages[currentMessage]}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
