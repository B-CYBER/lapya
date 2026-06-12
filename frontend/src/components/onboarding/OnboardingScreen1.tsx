import React, { useState } from 'react';
import { Activity, Heart, Stethoscope, ChevronLeft } from 'lucide-react';
import Container from '../layout/Container';

interface OnboardingScreen1Props {
  onNext: (data: { name: string; role: string }) => void;
  onBack?: () => void;
  defaultName?: string;
  defaultRole?: string;
}

export const OnboardingScreen1 = ({ onNext, onBack, defaultName = '', defaultRole = '' }: OnboardingScreen1Props) => {
  const [name, setName] = useState(defaultName);
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  const roles = [
    {
      id: 'patient',
      icon: Activity,
      label: "I'm managing my own health",
      description: 'Patient'
    },
    {
      id: 'caregiver',
      icon: Heart,
      label: "I'm caring for someone I love",
      description: 'Caregiver'
    },
    {
      id: 'dietitian',
      icon: Stethoscope,
      label: "I'm a registered dietitian",
      description: 'Dietitian'
    }
  ];

  const handleNext = () => {
    if (name && selectedRole) {
      onNext({ name, role: selectedRole });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      <Container maxWidth="auth">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-6">
          {onBack && (
            <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex-1" />
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: step === 1 ? '#3D6BE5' : '#E7E4DD'
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
          marginBottom: '1.5rem'
        }}>
          What should we call you?
        </h1>

        <input
          type="text"
          placeholder="e.g. Bola"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mb-8"
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

        <h2 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E',
          marginBottom: '1rem'
        }}>
          And who is Lapya for?
        </h2>

        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className="w-full p-5 rounded-2xl text-left transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? '#A8BCF0' : '#FFFFFF',
                  border: `1.5px solid ${isSelected ? '#3D6BE5' : '#E7E4DD'}`,
                  boxShadow: isSelected ? '0 4px 16px rgba(30, 42, 94, 0.08)' : 'none'
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: isSelected ? '#3D6BE5' : '#A8BCF0'
                    }}
                  >
                    <Icon size={24} style={{ color: isSelected ? '#FFFFFF' : '#1E2A5E' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1E2A5E',
                      marginBottom: '0.25rem'
                    }}>
                      {role.label}
                    </p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#5E6680'
                    }}>
                      {role.description}
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
          disabled={!name || !selectedRole}
          className="w-full py-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: name && selectedRole ? '#3D6BE5' : '#E7E4DD',
            color: name && selectedRole ? '#FFFFFF' : '#5E6680',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: name && selectedRole ? 'pointer' : 'not-allowed',
            boxShadow: name && selectedRole ? '0 4px 16px rgba(30, 42, 94, 0.12)' : 'none'
          }}
        >
          Next
          </button>
        </div>
      </Container>
    </div>
  );
};
