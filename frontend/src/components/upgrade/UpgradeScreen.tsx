import React, { useState } from 'react';
import { X, Check, Crown, Heart, Sparkles } from 'lucide-react';
import Container from '../layout/Container';

interface UpgradeScreenProps {
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
}

export const UpgradeScreen = ({ onClose, onSelectPlan }: UpgradeScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'care'>('care');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      priceMonthly: '₦0',
      priceAnnual: '₦0',
      period: 'forever',
      icon: Heart,
      iconColor: '#A8BCF0',
      bgColor: 'rgba(168, 188, 240, 0.12)',
      borderColor: '#E7E4DD',
      features: [
        { text: '7-day meal plan', included: true },
        { text: 'Basic food scanner', included: true },
        { text: 'Safety ratings for your conditions', included: true },
        { text: 'Weekly grocery list', included: true },
        { text: 'Add caregivers', included: false },
        { text: 'Connect a dietitian', included: false },
        { text: 'Unlimited meal swaps', included: false },
        { text: 'Progress tracking & insights', included: false }
      ]
    },
    {
      id: 'care',
      name: 'Care',
      priceMonthly: '₦1,500',
      priceAnnual: '₦15,000',
      periodMonthly: '/month',
      periodAnnual: '/year',
      savingsText: 'Save ₦3,000',
      icon: Crown,
      iconColor: '#E8A92E',
      bgColor: 'rgba(232, 169, 46, 0.12)',
      borderColor: '#E8A92E',
      popular: true,
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Add 1 caregiver', included: true },
        { text: 'Connect your dietitian', included: true },
        { text: 'Custom meal preferences', included: true },
        { text: 'Unlimited meal swaps', included: true },
        { text: 'Progress tracking & insights', included: true },
        { text: 'Priority support', included: true },
        { text: 'Export meal history', included: true }
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan);

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
        style={{ backgroundColor: '#FBFAF7', borderColor: '#E7E4DD' }}
      >
        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E'
        }}>
          Choose Your Plan
        </h1>
        <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <Container maxWidth="content">
          {/* Hero Section */}
          <div className="pt-6 pb-5">
          <div
            className="p-6 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1E2A5E 0%, #3D6BE5 100%)'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={24} style={{ color: '#F4D27A' }} />
                <h2 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#F4D27A',
                  lineHeight: 1.2
                }}>
                  Get more from Lapya
                </h2>
              </div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#A8BCF0',
                lineHeight: 1.6
              }}>
                Unlock caregivers, dietitian access, and advanced meal customization to make managing your health easier.
              </p>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 opacity-10">
              <Crown size={120} style={{ color: '#E8A92E' }} />
            </div>
          </div>
        </div>

          {/* Billing Period Toggle */}
          <div className="mb-5">
          <div
            className="flex p-1.5 rounded-xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD'
            }}
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="flex-1 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: billingPeriod === 'monthly' ? '#3D6BE5' : 'transparent',
                color: billingPeriod === 'monthly' ? '#FFFFFF' : '#5E6680',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className="flex-1 py-2.5 rounded-lg transition-all relative"
              style={{
                backgroundColor: billingPeriod === 'annual' ? '#3D6BE5' : 'transparent',
                color: billingPeriod === 'annual' ? '#FFFFFF' : '#5E6680',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Annual
              <span
                className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: '#6E9A6E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '0.3px'
                }}
              >
                SAVE
              </span>
            </button>
          </div>
        </div>

          {/* Plan Cards */}
          <div className="space-y-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as 'free' | 'care')}
              className="w-full p-6 rounded-3xl text-left transition-all relative"
              style={{
                backgroundColor: plan.id === selectedPlan ? plan.bgColor : '#FFFFFF',
                border: `2px solid ${plan.id === selectedPlan ? plan.borderColor : '#E7E4DD'}`,
                boxShadow: plan.id === selectedPlan ? `0 8px 24px ${plan.borderColor}40` : '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3 left-6 px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: '#E8A92E',
                    boxShadow: '0 4px 12px rgba(232, 169, 46, 0.3)'
                  }}
                >
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    letterSpacing: '0.5px'
                  }}>
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.iconColor}20` }}
                  >
                    <plan.icon size={24} style={{ color: plan.iconColor }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1E2A5E',
                      marginBottom: '0.125rem'
                    }}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: plan.iconColor
                      }}>
                        {plan.id === 'free'
                          ? plan.priceMonthly
                          : billingPeriod === 'monthly'
                            ? plan.priceMonthly
                            : plan.priceAnnual}
                      </span>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#5E6680'
                      }}>
                        {plan.id === 'free'
                          ? plan.period
                          : billingPeriod === 'monthly'
                            ? plan.periodMonthly
                            : plan.periodAnnual}
                      </span>
                    </div>
                    {plan.id !== 'free' && billingPeriod === 'annual' && plan.savingsText && (
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#6E9A6E',
                        marginTop: '0.25rem'
                      }}>
                        {plan.savingsText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Radio Button */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: plan.id === selectedPlan ? plan.borderColor : 'transparent',
                    border: `2px solid ${plan.id === selectedPlan ? plan.borderColor : '#E7E4DD'}`
                  }}
                >
                  {plan.id === selectedPlan && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#FFFFFF' }}
                    />
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2.5">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: feature.included ? `${plan.iconColor}20` : 'transparent',
                        border: feature.included ? 'none' : '1.5px solid #E7E4DD'
                      }}
                    >
                      {feature.included && (
                        <Check size={12} style={{ color: plan.iconColor }} />
                      )}
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: feature.included ? '#1E2A5E' : '#5E6680',
                      opacity: feature.included ? 1 : 0.6,
                      lineHeight: 1.5
                    }}>
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

          {/* Trust Indicators */}
          <div className="mt-6">
          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: 'rgba(110, 154, 110, 0.12)',
              border: '1px solid rgba(110, 154, 110, 0.3)'
            }}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6
                }}>
                  <strong>Cancel anytime.</strong> No commitments, pause or stop your subscription whenever you want.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.25rem' }}>💳</span>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6
                }}>
                  <strong>Secure payments.</strong> Pay with card, bank transfer, or mobile money.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.25rem' }}>🔒</span>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6
                }}>
                  <strong>Your data is private.</strong> We never share your health information.
                </p>
              </div>
            </div>
          </div>
          </div>
        </Container>
      </div>

      {/* Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-6 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E7E4DD'
        }}
      >
        {selectedPlan === 'free' ? (
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid #3D6BE5',
              color: '#3D6BE5',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Continue with Free
          </button>
        ) : (
          <button
            onClick={() => onSelectPlan?.(selectedPlan)}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: currentPlan?.borderColor,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${currentPlan?.borderColor}40`
            }}
          >
            Subscribe to {currentPlan?.name} — {billingPeriod === 'monthly' ? currentPlan?.priceMonthly : currentPlan?.priceAnnual}{billingPeriod === 'monthly' ? '/month' : '/year'}
          </button>
        )}
      </div>
    </div>
  );
};