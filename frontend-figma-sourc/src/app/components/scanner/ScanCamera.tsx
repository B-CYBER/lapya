import React from 'react';
import { X, Image } from 'lucide-react';

interface ScanCameraProps {
  onCapture: () => void;
  onClose: () => void;
}

export const ScanCamera = ({ onCapture, onClose }: ScanCameraProps) => {
  return (
    <div
      className="w-full h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1E2A5E' }}
    >
      {/* Camera Viewfinder Placeholder */}
      <div className="flex-1 relative">
        {/* Simulated camera feed - placeholder with food image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&q=80"
            alt="Camera viewfinder"
            className="w-full h-full object-cover opacity-70"
          />
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <X size={24} style={{ color: '#FFFFFF' }} />
          </button>
          <button
            className="p-2 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Image size={24} style={{ color: '#FFFFFF' }} />
          </button>
        </div>

        {/* Scanning Reticle */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div
            className="relative"
            style={{
              width: '280px',
              height: '280px'
            }}
          >
            {/* Square frame with rounded corners */}
            <svg
              width="280"
              height="280"
              viewBox="0 0 280 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              {/* Top-left corner */}
              <path
                d="M 20 60 L 20 20 L 60 20"
                stroke="#E8A92E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Top-right corner */}
              <path
                d="M 220 20 L 260 20 L 260 60"
                stroke="#E8A92E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Bottom-right corner */}
              <path
                d="M 260 220 L 260 260 L 220 260"
                stroke="#E8A92E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Bottom-left corner */}
              <path
                d="M 60 260 L 20 260 L 20 220"
                stroke="#E8A92E"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* Center dot */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#E8A92E' }}
            />
          </div>
        </div>

        {/* Helper Text */}
        <div className="absolute bottom-32 left-0 right-0 px-8 text-center">
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              color: '#A8BCF0',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            Point at your meal. Works best with full plate in frame.
          </p>
        </div>
      </div>

      {/* Capture Button */}
      <div className="pb-12 flex justify-center">
        <button
          onClick={onCapture}
          className="relative transition-transform active:scale-95"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div
            className="absolute inset-0 m-1.5 rounded-full"
            style={{
              backgroundColor: '#FFFFFF',
              border: '3px solid #3D6BE5'
            }}
          />
        </button>
      </div>
    </div>
  );
};
