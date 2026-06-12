import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface OnboardingCompleteProps {
  userName: string;
  onContinue: () => void;
}

export const OnboardingComplete = ({ userName, onContinue }: OnboardingCompleteProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);

    // Fire confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E8A92E', '#F4D27A', '#3D6BE5', '#A8BCF0']
      });
    }, 500);
  }, []);

  return (
    <div
      className="w-full h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1E2A5E 0%, #3D6BE5 100%)'
      }}
    >
      {/* Decorative blueberry circles */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#E8A92E' }} />
      <div className="absolute bottom-32 left-10 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: '#F4D27A' }} />
      <div className="absolute top-1/3 left-5 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: '#A8BCF0' }} />

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Container maxWidth="auth">
          {/* Success icon with animation */}
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E8A92E' }}
              >
                <CheckCircle2 size={48} style={{ color: '#1E2A5E' }} />
              </div>

              {/* Sparkle effects */}
              <Sparkles
                size={24}
                className="absolute -top-2 -right-2 animate-pulse"
                style={{ color: '#F4D27A' }}
              />
              <Sparkles
                size={20}
                className="absolute -bottom-1 -left-2 animate-pulse"
                style={{ color: '#F4D27A', animationDelay: '0.5s' }}
              />
            </div>
          </div>

          {/* Main heading */}
          <h1
            className="text-center mb-4"
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#F4D27A',
              lineHeight: 1.1
            }}
          >
            All set, {userName}!
          </h1>

          {/* Subheading */}
          <p
            className="text-center mb-12"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.125rem',
              color: '#A8BCF0',
              lineHeight: 1.6
            }}
          >
            Your personalized meal plan is ready. Let's help you eat well, even with everything.
          </p>

          {/* Feature cards */}
          <div className="w-full space-y-3 mb-12">
          {[
            { icon: '🍽️', text: 'Meals tailored to your conditions' },
            { icon: '📍', text: 'Foods available in your region' },
            { icon: '💚', text: 'Safe, balanced portions just for you' }
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: 'rgba(168, 188, 240, 0.15)',
                border: '1px solid rgba(168, 188, 240, 0.3)',
                animationDelay: `${index * 0.2}s`
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#F4F1EA',
                  fontWeight: 500
                }}
              >
                {feature.text}
              </p>
            </div>
          ))}
          </div>
        </Container>
      </div>

      {/* Continue button */}
      <Container maxWidth="auth">
        <div className="py-8">
          <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl transition-all duration-200 active:scale-95"
          style={{
            backgroundColor: '#E8A92E',
            color: '#1E2A5E',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.0625rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232, 169, 46, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F4D27A';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(232, 169, 46, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E8A92E';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 169, 46, 0.3)';
          }}
        >
          See my meal plan
          </button>
        </div>
      </Container>
    </div>
  );
};
