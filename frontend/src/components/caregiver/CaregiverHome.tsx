import React from 'react';
import { Bell, Calendar, ShoppingCart, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface CaregiverMealRow {
  type: string;
  time: string;
  name: string;
  logged: boolean;
  loggedAt?: string;
}

interface CaregiverHomeProps {
  patientName: string;
  onViewWeek?: () => void;
  onViewGroceryList?: () => void;
  onOpenMessages?: () => void;
  todaysMeals?: CaregiverMealRow[];
}

export const CaregiverHome = ({
  patientName = "Mama",
  onViewWeek,
  onViewGroceryList,
  onOpenMessages,
  todaysMeals: todaysMealsProp,
}: CaregiverHomeProps) => {
  const todaysMeals: CaregiverMealRow[] = todaysMealsProp ?? [
    {
      type: 'BREAKFAST',
      time: '8:00 AM',
      name: 'Moin Moin + Pap',
      logged: true,
      loggedAt: '8:15 AM'
    },
    {
      type: 'LUNCH',
      time: '1:00 PM',
      name: 'Brown Rice & Garden Egg Stew',
      logged: false
    },
    {
      type: 'DINNER',
      time: '7:00 PM',
      name: 'Okra Soup + Small Eba',
      logged: false
    }
  ];

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: '#FBFAF7' }}>
        <LapyaLogo size={32} onDark={false} />
        <div className="flex items-center gap-4">
          <button className="p-2" style={{ color: '#1E2A5E' }}>
            <Bell size={22} />
          </button>
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#E8A92E' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <Container maxWidth="dashboard">
          {/* Viewing Header Card */}
          <div className="mt-4 mb-6 p-5 rounded-2xl" style={{ backgroundColor: '#3D6BE5' }}>
          <div className="flex items-start justify-between">
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#A8BCF0',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                CARE MODE
              </p>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '0.25rem'
              }}>
                Viewing {patientName}'s plan
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#A8BCF0'
              }}>
                You can help log meals and check progress
              </p>
            </div>
          </div>
        </div>

          {/* Today's Meals Progress */}
          <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#1E2A5E'
            }}>
              Today's meals
            </h3>
            <button
              onClick={onViewWeek}
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

          {/* Meal List */}
          <div className="space-y-3">
            {todaysMeals.map((meal, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${meal.logged ? '#6E9A6E' : '#E7E4DD'}`,
                  boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#3D6BE5',
                        letterSpacing: '0.5px'
                      }}>
                        {meal.type}
                      </span>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.6875rem',
                        color: '#5E6680'
                      }}>
                        {meal.time}
                      </span>
                    </div>
                    <h4 style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1E2A5E'
                    }}>
                      {meal.name}
                    </h4>
                  </div>
                  {meal.logged ? (
                    <div
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(110, 154, 110, 0.15)' }}
                    >
                      <CheckCircle2 size={14} style={{ color: '#6E9A6E' }} />
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#6E9A6E'
                      }}>
                        Logged
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(168, 188, 240, 0.15)' }}
                    >
                      <Clock size={14} style={{ color: '#5E6680' }} />
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#5E6680'
                      }}>
                        Pending
                      </span>
                    </div>
                  )}
                </div>
                {meal.logged && meal.loggedAt && (
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#5E6680',
                    marginTop: '0.5rem'
                  }}>
                    Logged at {meal.loggedAt}
                  </p>
                )}
                {!meal.logged && (
                  <button
                    className="mt-3 px-4 py-2 rounded-lg"
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
                    Log this meal
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

          {/* Grocery List Preview */}
          <div className="mb-6">
          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD',
              boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#A8BCF0' }}
                >
                  <ShoppingCart size={24} style={{ color: '#1E2A5E' }} />
                </div>
                <div>
                  <h4 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1E2A5E',
                    marginBottom: '0.25rem'
                  }}>
                    This week's grocery list
                  </h4>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#5E6680'
                  }}>
                    22 items • 8 checked off
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onViewGroceryList}
              className="w-full py-4 rounded-lg"
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
              View full list
            </button>
          </div>
        </div>

          {/* Quick Message */}
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
              <MessageSquare size={20} style={{ color: '#E8A92E', marginTop: '0.125rem' }} />
              <div className="flex-1">
                <h4 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  marginBottom: '0.5rem'
                }}>
                  Send {patientName} a message
                </h4>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#5E6680',
                  lineHeight: 1.6,
                  marginBottom: '0.75rem'
                }}>
                  Check in or remind them about today's meals
                </p>
                <button
                  onClick={onOpenMessages}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#3D6BE5',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Open messages →
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* Care Tip */}
          <div className="mb-6">
          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: 'rgba(168, 188, 240, 0.12)',
              border: '1px solid rgba(168, 188, 240, 0.3)'
            }}
          >
            <div className="flex items-start gap-3">
              <div style={{ fontSize: '1.5rem' }}>💙</div>
              <div className="flex-1">
                <h4 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  marginBottom: '0.5rem'
                }}>
                  Care tip
                </h4>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6
                }}>
                  Regular meal logging helps track patterns and spot foods that work best for {patientName}.
                </p>
              </div>
            </div>
          </div>
          </div>
        </Container>
      </div>

      {/* Bottom Navigation */}
      <div
        className="flex items-center justify-around py-3 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E7E4DD',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '390px',
          margin: '0 auto'
        }}
      >
        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div style={{ color: '#1E2A5E' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#3D6BE5' }} />
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <Calendar size={24} style={{ color: '#5E6680' }} />
        </button>

        <button
          className="flex items-center justify-center -mt-6"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#E8A92E',
            border: '4px solid #FBFAF7',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232, 169, 46, 0.3)'
          }}
        >
          <MessageSquare size={24} style={{ color: '#1E2A5E' }} />
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <ShoppingCart size={24} style={{ color: '#5E6680' }} />
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <div style={{ color: '#5E6680' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
