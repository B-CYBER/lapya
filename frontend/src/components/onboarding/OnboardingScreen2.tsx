import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import Container from '../layout/Container';

interface OnboardingScreen2Props {
  onNext: (data: { conditions: Array<{ id: string; severity: string }> }) => void;
  onBack: () => void;
}

export const OnboardingScreen2 = ({ onNext, onBack }: OnboardingScreen2Props) => {
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set());
  const [severities, setSeverities] = useState<Record<string, string>>({});

  const conditions = [
    { id: 'diabetes', label: 'Type 2 Diabetes' },
    { id: 'hypertension', label: 'High Blood Pressure' },
    { id: 'kidney', label: 'Kidney Disease' },
    { id: 'heart', label: 'Heart Disease' },
    { id: 'weight', label: 'Weight Management' },
    { id: 'cholesterol', label: 'High Cholesterol' },
    { id: 'uric-acid', label: 'Uric Acid/Gout' },
    { id: 'migraines', label: 'Migraines' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'acid-reflux', label: 'Acid Reflux/GERD' },
    { id: 'fatty-liver', label: 'Fatty Liver Disease' },
    { id: 'arthritis', label: 'Arthritis' }
  ];

  const severityLevels = ['Mild', 'Moderate', 'Severe'];

  const toggleCondition = (id: string) => {
    const newSelected = new Set(selectedConditions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      const newSeverities = { ...severities };
      delete newSeverities[id];
      setSeverities(newSeverities);
    } else {
      newSelected.add(id);
    }
    setSelectedConditions(newSelected);
  };

  const setSeverity = (conditionId: string, severity: string) => {
    setSeverities({ ...severities, [conditionId]: severity });
  };

  const handleNext = () => {
    const conditionsData = Array.from(selectedConditions).map(id => ({
      id,
      severity: severities[id] || 'Moderate'
    }));
    onNext({ conditions: conditionsData });
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
                backgroundColor: step === 2 ? '#3D6BE5' : step < 2 ? '#A8BCF0' : '#E7E4DD'
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
          What are you living with?
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: '#5E6680',
          marginBottom: '2rem'
        }}>
          Select all that apply. You can change this anytime.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {conditions.map((condition) => {
            const isSelected = selectedConditions.has(condition.id);

            return (
              <div key={condition.id} className="relative">
                <button
                  onClick={() => toggleCondition(condition.id)}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-200 relative"
                  style={{
                    backgroundColor: isSelected ? '#A8BCF0' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#3D6BE5' : '#E7E4DD'}`,
                    minHeight: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#1E2A5E',
                    lineHeight: 1.3
                  }}>
                    {condition.label}
                  </p>

                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#E8A92E'
                      }}
                    >
                      <Check size={14} style={{ color: '#1E2A5E' }} />
                    </div>
                  )}
                </button>

                {/* Severity Dropdown */}
                {isSelected && (
                  <div className="mt-2">
                    <select
                      value={severities[condition.id] || 'Moderate'}
                      onChange={(e) => setSeverity(condition.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7E4DD',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#1E2A5E',
                        outline: 'none'
                      }}
                    >
                      {severityLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7E4DD'
          }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: '#5E6680',
            lineHeight: 1.5
          }}>
            Lapya is not a replacement for your doctor.
          </p>
        </div>
        </Container>
      </div>

      {/* Next Button */}
      <Container maxWidth="auth">
        <div className="py-8">
          <button
          onClick={handleNext}
          disabled={selectedConditions.size === 0}
          className="w-full py-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: selectedConditions.size > 0 ? '#3D6BE5' : '#E7E4DD',
            color: selectedConditions.size > 0 ? '#FFFFFF' : '#5E6680',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: selectedConditions.size > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedConditions.size > 0 ? '0 4px 16px rgba(30, 42, 94, 0.12)' : 'none'
          }}
        >
          Next
          </button>
        </div>
      </Container>
    </div>
  );
};
