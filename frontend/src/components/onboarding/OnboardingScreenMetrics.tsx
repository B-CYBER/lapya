import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Container from '../layout/Container';

interface OnboardingScreenMetricsProps {
  onNext: (data: { age: string; weight: string; lastBpCheck?: string; bpReading?: string }) => void;
  onBack: () => void;
  hasHypertension: boolean;
}

export const OnboardingScreenMetrics = ({ onNext, onBack, hasHypertension }: OnboardingScreenMetricsProps) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [lastBpCheck, setLastBpCheck] = useState('');
  const [bpReading, setBpReading] = useState('');

  const handleNext = () => {
    if (age && weight) {
      const data: any = { age, weight };
      if (hasHypertension) {
        data.lastBpCheck = lastBpCheck;
        data.bpReading = bpReading;
      }
      onNext(data);
    }
  };

  const isValid = age && weight && (!hasHypertension || (lastBpCheck && bpReading));

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      <Container maxWidth="auth">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-6">
          <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: step === 5 ? '#3D6BE5' : step < 5 ? '#A8BCF0' : '#E7E4DD'
              }}
            />
          ))}
        </div>
      </Container>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Container maxWidth="auth">
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '2rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '0.75rem'
        }}>
          A few more details
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: '#5E6680',
          marginBottom: '2rem'
        }}>
          This helps us personalize your meal portions.
        </p>

        {/* Age Input */}
        <div className="mb-6">
          <label
            htmlFor="age"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.75rem'
            }}
          >
            Your age
          </label>
          <input
            id="age"
            type="number"
            placeholder="e.g., 45"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E7E4DD',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: '#1A2244',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3D6BE5';
              e.target.style.boxShadow = '0 0 0 3px rgba(61, 107, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E7E4DD';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Weight Input */}
        <div className="mb-6">
          <label
            htmlFor="weight"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.75rem'
            }}
          >
            Current weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            placeholder="e.g., 75"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E7E4DD',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: '#1A2244',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3D6BE5';
              e.target.style.boxShadow = '0 0 0 3px rgba(61, 107, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E7E4DD';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Conditional BP Fields */}
        {hasHypertension && (
          <>
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: '#A8BCF0',
                border: '1px solid #3D6BE5'
              }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#1E2A5E',
                lineHeight: 1.5
              }}>
                Since you have high blood pressure, we'd like to know your latest reading.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="lastBpCheck"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  display: 'block',
                  marginBottom: '0.75rem'
                }}
              >
                When was your last BP check?
              </label>
              <input
                id="lastBpCheck"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={lastBpCheck}
                onChange={(e) => setLastBpCheck(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E7E4DD',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: lastBpCheck ? '#1A2244' : '#9CA3AF',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3D6BE5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(61, 107, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E7E4DD';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="bpReading"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  display: 'block',
                  marginBottom: '0.75rem'
                }}
              >
                Your BP reading
              </label>
              <input
                id="bpReading"
                type="text"
                placeholder="e.g., 130/85"
                value={bpReading}
                onChange={(e) => setBpReading(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E7E4DD',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  color: '#1A2244',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3D6BE5';
                  e.target.style.boxShadow = '0 0 0 3px rgba(61, 107, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E7E4DD';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </>
        )}
        </Container>
      </div>

      {/* Next Button */}
      <Container maxWidth="auth">
        <div className="py-8">
          <button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full py-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: isValid ? '#3D6BE5' : '#E7E4DD',
            color: isValid ? '#FFFFFF' : '#5E6680',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: isValid ? 'pointer' : 'not-allowed',
            boxShadow: isValid ? '0 4px 16px rgba(30, 42, 94, 0.12)' : 'none'
          }}
        >
          Next
          </button>
        </div>
      </Container>
    </div>
  );
};
