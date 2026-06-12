import React, { useEffect, useRef, useState } from 'react';
import { X, Image } from 'lucide-react';

interface ScanCameraProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const ScanCamera = ({ onCapture, onClose }: ScanCameraProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Camera unavailable.';
        setCameraError(msg);
      }
    }
    void start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || isCapturing) return;
    setIsCapturing(true);
    try {
      const width = video.videoWidth || 720;
      const height = video.videoHeight || 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85),
      );
      if (blob) onCapture(blob);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1E2A5E' }}
    >
      {/* Camera Viewfinder */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {cameraError ? (
            <div className="px-8 text-center">
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#F4F1EA',
                  lineHeight: 1.6,
                }}
              >
                Could not start the camera: {cameraError}
                <br />
                Try allowing camera permission in your browser settings.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
          )}
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
          onClick={handleCapture}
          disabled={!!cameraError || isCapturing}
          className="relative transition-transform active:scale-95"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: 'none',
            cursor: cameraError ? 'not-allowed' : 'pointer',
            opacity: cameraError ? 0.5 : 1,
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
