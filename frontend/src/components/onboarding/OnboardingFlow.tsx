import React, { useEffect, useState } from 'react';
import { OnboardingScreen1 } from './OnboardingScreen1';
import { OnboardingScreen2 } from './OnboardingScreen2';
import { OnboardingScreen3 } from './OnboardingScreen3';
import { OnboardingScreenLocation } from './OnboardingScreenLocation';
import { OnboardingScreenMetrics } from './OnboardingScreenMetrics';
import { OnboardingScreen4 } from './OnboardingScreen4';
import { OnboardingComplete } from './OnboardingComplete';

export interface OnboardingUserData {
  name: string;
  role: string;
  conditions: Array<{ id: string; severity: string }>;
  foods: string[];
  allergies: string;
  location: string;
  age: string;
  weight: string;
  lastBpCheck: string;
  bpReading: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingUserData) => void | Promise<void>;
  defaultName?: string;
}

const EMPTY_USER_DATA: OnboardingUserData = {
  name: '',
  role: '',
  conditions: [],
  foods: [],
  allergies: '',
  location: '',
  age: '',
  weight: '',
  lastBpCheck: '',
  bpReading: '',
};

const STORAGE_KEY = 'lapya_onboarding';

interface PersistedState {
  step: number;
  userData: OnboardingUserData;
}

const loadPersisted = (defaultName: string): PersistedState => {
  if (typeof window === 'undefined') {
    return { step: 1, userData: { ...EMPTY_USER_DATA, name: defaultName } };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && typeof parsed.step === 'number' && parsed.userData) {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors, fall through to defaults
  }
  return { step: 1, userData: { ...EMPTY_USER_DATA, name: defaultName } };
};

export const OnboardingFlow = ({ onComplete, defaultName = '' }: OnboardingFlowProps) => {
  const [{ step: currentStep, userData }, setState] = useState<PersistedState>(() =>
    loadPersisted(defaultName)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep, userData }));
  }, [currentStep, userData]);

  const advance = (patch: Partial<OnboardingUserData>, nextStep: number) => {
    setState((prev) => ({
      step: nextStep,
      userData: { ...prev.userData, ...patch },
    }));
  };

  const goBack = (step: number) => {
    setState((prev) => ({ ...prev, step }));
  };

  const handleStep1Next = (data: { name: string; role: string }) =>
    advance(data, data.role === 'dietitian' ? 6 : 2);
  const handleStep2Next = (data: { conditions: Array<{ id: string; severity: string }> }) =>
    advance(data, 3);
  const handleStep3Next = (data: { foods: string[]; allergies: string }) => advance(data, 4);
  const handleStep4Next = (data: { location: string }) => advance(data, 5);
  const handleStep5Next = (data: {
    age: string;
    weight: string;
    lastBpCheck?: string;
    bpReading?: string;
  }) =>
    advance(
      {
        age: data.age,
        weight: data.weight,
        lastBpCheck: data.lastBpCheck ?? '',
        bpReading: data.bpReading ?? '',
      },
      6,
    );

  const handleLoadingComplete = () => setState((prev) => ({ ...prev, step: 7 }));

  const handleFinalContinue = () => {
    void onComplete(userData);
  };

  const conditionLabels = userData.conditions.map((c) => {
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
      arthritis: 'arthritis',
    };
    return labels[c.id] || c.id;
  });

  const hasHypertension = userData.conditions.some((c) => c.id === 'hypertension');

  return (
    <>
      {currentStep === 1 && (
        <OnboardingScreen1
          onNext={handleStep1Next}
          defaultName={userData.name || defaultName}
          defaultRole={userData.role}
        />
      )}
      {currentStep === 2 && (
        <OnboardingScreen2 onNext={handleStep2Next} onBack={() => goBack(1)} />
      )}
      {currentStep === 3 && (
        <OnboardingScreen3 onNext={handleStep3Next} onBack={() => goBack(2)} />
      )}
      {currentStep === 4 && (
        <OnboardingScreenLocation onNext={handleStep4Next} onBack={() => goBack(3)} />
      )}
      {currentStep === 5 && (
        <OnboardingScreenMetrics
          onNext={handleStep5Next}
          onBack={() => goBack(4)}
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
        <OnboardingComplete userName={userData.name} onContinue={handleFinalContinue} />
      )}
    </>
  );
};
