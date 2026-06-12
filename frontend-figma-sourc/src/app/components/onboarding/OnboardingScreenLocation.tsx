import React, { useState } from 'react';
import { ChevronLeft, MapPin } from 'lucide-react';
import Container from '../layout/Container';

interface OnboardingScreenLocationProps {
  onNext: (data: { location: string }) => void;
  onBack: () => void;
}

export const OnboardingScreenLocation = ({ onNext, onBack }: OnboardingScreenLocationProps) => {
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = [
    { id: 'north-central', label: 'North Central', description: 'FCT, Niger, Plateau, Benue, Nasarawa, Kogi' },
    { id: 'north-east', label: 'North East', description: 'Borno, Adamawa, Taraba, Yobe, Bauchi, Gombe' },
    { id: 'north-west', label: 'North West', description: 'Kaduna, Kano, Katsina, Jigawa, Zamfara, Sokoto, Kebbi' },
    { id: 'south-east', label: 'South East', description: 'Abia, Anambra, Ebonyi, Enugu, Imo' },
    { id: 'south-south', label: 'South South', description: 'Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Rivers' },
    { id: 'south-west', label: 'South West', description: 'Ekiti, Lagos, Ogun, Ondo, Osun, Oyo' }
  ];

  const handleNext = () => {
    if (selectedLocation) {
      onNext({ location: selectedLocation });
    }
  };

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
                backgroundColor: step === 4 ? '#3D6BE5' : step < 4 ? '#A8BCF0' : '#E7E4DD'
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
          Where are you based?
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: '#5E6680',
          marginBottom: '2rem'
        }}>
          This helps us recommend foods available in your region.
        </p>

        <div className="space-y-3">
          {locations.map((location) => {
            const isSelected = selectedLocation === location.id;

            return (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className="w-full p-5 rounded-2xl text-left transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? '#A8BCF0' : '#FFFFFF',
                  border: `1.5px solid ${isSelected ? '#3D6BE5' : '#E7E4DD'}`,
                  boxShadow: isSelected ? '0 4px 16px rgba(30, 42, 94, 0.08)' : 'none'
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? '#3D6BE5' : '#A8BCF0'
                    }}
                  >
                    <MapPin size={20} style={{ color: isSelected ? '#FFFFFF' : '#1E2A5E' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1E2A5E',
                      marginBottom: '0.25rem'
                    }}>
                      {location.label}
                    </p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#5E6680',
                      lineHeight: 1.4
                    }}>
                      {location.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        </Container>
      </div>

      {/* Next Button */}
      <Container maxWidth="auth">
        <div className="py-8">
          <button
          onClick={handleNext}
          disabled={!selectedLocation}
          className="w-full py-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: selectedLocation ? '#3D6BE5' : '#E7E4DD',
            color: selectedLocation ? '#FFFFFF' : '#5E6680',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: selectedLocation ? 'pointer' : 'not-allowed',
            boxShadow: selectedLocation ? '0 4px 16px rgba(30, 42, 94, 0.12)' : 'none'
          }}
        >
          Next
          </button>
        </div>
      </Container>
    </div>
  );
};
