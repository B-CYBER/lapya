import React, { useState } from 'react';
import { OnboardingScreen1 } from './OnboardingScreen1';
import { OnboardingScreen2 } from './OnboardingScreen2';
import { OnboardingScreen3 } from './OnboardingScreen3';
import { OnboardingScreenLocation } from './OnboardingScreenLocation';
import { OnboardingScreenMetrics } from './OnboardingScreenMetrics';
import { OnboardingScreen4 } from './OnboardingScreen4';
import { OnboardingComplete } from './OnboardingComplete';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    role: '',
    conditions: [] as Array<{ id: string; severity: string }>,
    foods: [] as string[],
    allergies: '',
    location: '',
    age: '',
    weight: '',
    lastBpCheck: '',
    bpReading: ''
  });

  const handleStep1Next = (data: { name: string; role: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(2);
  };

  const handleStep2Next = (data: { conditions: Array<{ id: string; severity: string }> }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(3);
  };

  const handleStep3Next = (data: { foods: string[]; allergies: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(4);
  };

  const handleStep4Next = (data: { location: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(5);
  };

  const handleStep5Next = (data: { age: string; weight: string; lastBpCheck?: string; bpReading?: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(6);
  };

  const handleLoadingComplete = () => {
    setCurrentStep(7);
  };

  const conditionLabels = userData.conditions.map(c => {
    const labels: Record<string, string> = {
      diabetes: 'diabetes',
      hypertension: 'blood pressure',
      kidney: 'kidney disease',
      heart: 'heart disease',
      weight: 'weight management',
      cholesterol: 'high cholesterol',
      'uric-acid': 'uric acid',
      migraines: 'migraines',
      anxiety: 'anxiety',
      'acid-reflux': 'acid reflux',
      'fatty-liver': 'fatty liver',
      arthritis: 'arthritis'
    };
    return labels[c.id] || c.id;
  });

  const hasHypertension = userData.conditions.some(c => c.id === 'hypertension');

  return (
    <>
      {currentStep === 1 && (
        <OnboardingScreen1
          onNext={handleStep1Next}
        />
      )}
      {currentStep === 2 && (
        <OnboardingScreen2
          onNext={handleStep2Next}
          onBack={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <OnboardingScreen3
          onNext={handleStep3Next}
          onBack={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 4 && (
        <OnboardingScreenLocation
          onNext={handleStep4Next}
          onBack={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 5 && (
        <OnboardingScreenMetrics
          onNext={handleStep5Next}
          onBack={() => setCurrentStep(4)}
          hasHypertension={hasHypertension}
        />
      )}
      {currentStep === 6 && (
        <OnboardingScreen4
          userName={userData.name}
          conditions={conditionLabels}
          onComplete={handleLoadingComplete}
        />
      )}
      {currentStep === 7 && (
        <OnboardingComplete
          userName={userData.name}
          onContinue={onComplete}
        />
      )}
    </>
  );
};
