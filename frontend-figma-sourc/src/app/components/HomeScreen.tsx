import React from 'react';
import { Bell, MessageCircle, ShoppingCart, Flame, Users, Sparkles } from 'lucide-react';
import { LapyaLogo } from './LapyaLogo';
import Container from './layout/Container';

interface HomeScreenProps {
  onNavigateToWeek?: () => void;
  onOpenScanner?: () => void;
  onOpenGroceryList?: () => void;
  onOpenCareCircle?: () => void;
  onOpenUpgrade?: () => void;
  onOpenProfile?: () => void;
  onOpenPolishDemo?: () => void;
  onOpenNotifications?: () => void;
  onOpenHealthMetrics?: () => void;
  userName?: string;
  userPlan?: 'free' | 'care';
}

export const HomeScreen = ({ 
  onNavigateToWeek, 
  onOpenScanner, 
  onOpenGroceryList, 
  onOpenCareCircle, 
  onOpenUpgrade, 
  onOpenProfile, 
  onOpenPolishDemo, 
  onOpenNotifications, 
  onOpenHealthMetrics,
  userName = 'Mama',
  userPlan = 'free'
}: HomeScreenProps) => {
  const allMeals = [
    {
      type: 'BREAKFAST',
      name: 'Moin Moin + Pap',
      image: 'https://images.unsplash.com/photo-1638436684761-7e59f8a9072f?w=800&q=80',
      safety: 'safe',
      safetyText: 'Safe for diabetes & BP',
      portion: '1 wrap + 1 cigar cup'
    },
    {
      type: 'LUNCH',
      name: 'Brown Rice & Garden Egg Stew',
      image: 'https://images.unsplash.com/photo-1665332561290-cc6757172890?w=800&q=80',
      safety: 'safe',
      safetyText: 'Safe for diabetes & BP',
      portion: '1 derica rice + 1 cup stew'
    },
    {
      type: 'DINNER',
      name: 'Okra Soup + Small Eba',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
      safety: 'caution',
      safetyText: 'Half portion (diabetes)',
      portion: '1 hand-fistful eba'
    }
  ];

  // Free users only see breakfast and lunch
  const meals = userPlan === 'free' ? allMeals.filter(m => m.type !== 'DINNER') : allMeals;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Main Content Container */}
      <Container maxWidth="dashboard" className="py-6">
        {/* Greeting Hero Card */}
        <div className="mb-6 p-6 md:p-8 rounded-3xl relative overflow-hidden" style={{ backgroundColor: '#1E2A5E' }}>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <h2 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#F4D27A',
                lineHeight: 1.2
              }}>
                Good morning, {userName}
              </h2>
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(232, 169, 46, 0.2)', border: '1px solid #E8A92E' }}
              >
                <Flame size={14} style={{ color: '#E8A92E' }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#E8A92E'
                }}>
                  4-day streak
                </span>
              </div>
            </div>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#A8BCF0'
            }}>
              Day 4 of your plan — keep going.
            </p>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90%" cy="20%" r="40" fill="#A8BCF0" />
              <circle cx="10%" cy="80%" r="30" fill="#E8A92E" />
            </svg>
          </div>
        </div>

        {/* Today's Meals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1E2A5E'
            }}>
              Today's meals
            </h3>
            <button
              onClick={onNavigateToWeek}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#3D6BE5',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              See full week →
            </button>
          </div>

          {/* Responsive grid of meal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(30, 42, 94, 0.08)'
                }}
              >
                <div className="relative h-44">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgba(61, 107, 229, 0.95)',
                      color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {meal.type}
                  </div>
                </div>

                <div className="p-4">
                  <h4 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#1E2A5E',
                    marginBottom: '0.5rem'
                  }}>
                    {meal.name}
                  </h4>

                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meal.safety === 'safe' ? '#6E9A6E' : '#C9892E' }}
                    />
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: '#6E9A6E' }}
                    />
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#5E6680',
                      marginLeft: '0.25rem'
                    }}>
                      {meal.safetyText}
                    </p>
                  </div>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#5E6680',
                    marginBottom: '0.75rem'
                  }}>
                    {meal.portion}
                  </p>

                  <button
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1.5px solid #3D6BE5',
                      color: '#3D6BE5',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip of the Day */}
        <div className="mb-6">
          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              borderLeft: '4px solid #E8A92E',
              boxShadow: '0 4px 16px rgba(30, 42, 94, 0.06)'
            }}
          >
            <div className="flex items-start gap-3">
              <div style={{ fontSize: '1.5rem' }}>💡</div>
              <div className="flex-1">
                <h4 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  marginBottom: '0.5rem'
                }}>
                  Tip of the day
                </h4>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#5E6680',
                  lineHeight: 1.6
                }}>
                  Did you know? Plantain is high in potassium — great for blood pressure, but watch portions if you have kidney concerns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Promo */}
        <div className="mb-6">
          <button
            onClick={onOpenUpgrade}
            className="w-full p-5 rounded-2xl text-left transition-all"
            style={{
              background: 'linear-gradient(135deg, #E8A92E 0%, #F4D27A 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(232, 169, 46, 0.3)',
              cursor: 'pointer'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: '1.25rem' }}>👑</span>
                  <h4 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#1E2A5E'
                  }}>
                    Upgrade to Care
                  </h4>
                </div>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6,
                  marginBottom: '0.75rem'
                }}>
                  Add caregivers, connect your dietitian, and unlock unlimited meal customization.
                </p>
                <div
                  className="inline-block px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: '#1E2A5E',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#F4D27A'
                  }}
                >
                  From ₦1,500/month
                </div>
              </div>
              <div style={{ fontSize: '2rem', opacity: 0.5 }}>→</div>
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="pb-6">
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Quick actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={onOpenScanner}
              className="p-5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: '#A8BCF0' }}
              >
                <MessageCircle size={24} style={{ color: '#1E2A5E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                Ask Nutrition AI
              </p>
            </button>

            <button
              onClick={onOpenGroceryList}
              className="p-5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: '#A8BCF0' }}
              >
                <ShoppingCart size={24} style={{ color: '#1E2A5E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                My grocery list
              </p>
            </button>

            <button
              onClick={onOpenCareCircle}
              className="p-5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: '#E8A92E' }}
              >
                <Users size={24} style={{ color: '#1E2A5E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                Care circle
              </p>
            </button>

            <button
              onClick={onOpenPolishDemo}
              className="p-5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: '#A8BCF0' }}
              >
                <Sparkles size={24} style={{ color: '#1E2A5E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                Polish demo
              </p>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};