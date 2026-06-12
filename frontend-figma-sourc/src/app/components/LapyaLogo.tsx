import React from 'react';

// Simple LP placeholder logo
export const LapyaLogo = ({ size = 96, onDark = false }) => {
  return (
    <div
      className="flex items-center justify-center font-bold rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: onDark ? '#E8A92E' : '#1E2A5E',
        color: onDark ? '#1E2A5E' : '#F4D27A',
        fontFamily: 'Sora, sans-serif',
        fontSize: size * 0.4,
        fontWeight: 700
      }}
    >
      LP
    </div>
  );
};
