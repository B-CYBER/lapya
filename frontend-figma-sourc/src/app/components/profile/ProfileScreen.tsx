import React from 'react';
import { ChevronLeft, Edit3, Crown, Calendar, Heart, Users, Settings, Activity } from 'lucide-react';
import Container from '../layout/Container';

interface ProfileScreenProps {
  onBack: () => void;
  onOpenSettings?: () => void;
  onOpenCareCircle?: () => void;
  onOpenUpgrade?: () => void;
  onEditProfile?: () => void;
  onOpenHealthMetrics?: () => void;
}

export const ProfileScreen = ({ onBack, onOpenSettings, onOpenCareCircle, onOpenUpgrade, onEditProfile, onOpenHealthMetrics }: ProfileScreenProps) => {
  const userData = {
    name: 'Mrs. Adebayo',
    age: 58,
    weight: 72,
    conditions: [
      { name: 'Type 2 Diabetes', severity: 'Moderate' },
      { name: 'Hypertension', severity: 'Mild' }
    ],
    location: 'Lagos, South West',
    plan: 'Free',
    joinDate: 'April 2026',
    streak: 4,
    mealsLogged: 47,
    adherence: 92
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
        style={{ backgroundColor: '#FBFAF7', borderColor: '#E7E4DD' }}
      >
        <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E'
        }}>
          Profile
        </h1>
        <button onClick={onOpenSettings} className="p-2" style={{ color: '#1E2A5E' }}>
          <Settings size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="content">
          {/* Profile Header Card */}
          <div className="mt-6 mb-5 p-6 rounded-3xl" style={{ backgroundColor: '#1E2A5E' }}>
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <span style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                MA
              </span>
            </div>
            <div className="flex-1">
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.625rem',
                fontWeight: 700,
                color: '#F4D27A',
                marginBottom: '0.25rem'
              }}>
                {userData.name}
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#A8BCF0',
                marginBottom: '0.5rem'
              }}>
                {userData.age} years old
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: userData.plan === 'Free' ? 'rgba(168, 188, 240, 0.2)' : 'rgba(232, 169, 46, 0.2)',
                  border: `1px solid ${userData.plan === 'Free' ? '#A8BCF0' : '#E8A92E'}`
                }}
              >
                {userData.plan === 'Care' && <Crown size={14} style={{ color: '#E8A92E' }} />}
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: userData.plan === 'Free' ? '#A8BCF0' : '#E8A92E'
                }}>
                  {userData.plan} Plan
                </span>
              </div>
            </div>
            <button
              onClick={onEditProfile}
              className="p-2"
              style={{
                color: '#F4D27A',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Edit3 size={20} />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#E8A92E',
                marginBottom: '0.125rem'
              }}>
                {userData.streak}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#A8BCF0'
              }}>
                Day streak
              </p>
            </div>
            <div className="text-center">
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#E8A92E',
                marginBottom: '0.125rem'
              }}>
                {userData.mealsLogged}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#A8BCF0'
              }}>
                Meals logged
              </p>
            </div>
            <div className="text-center">
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#E8A92E',
                marginBottom: '0.125rem'
              }}>
                {userData.adherence}%
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#A8BCF0'
              }}>
                Adherence
              </p>
            </div>
          </div>
        </div>

          {/* Health Profile */}
          <div className="mb-5">
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Health Profile
          </h3>

          <div
            className="p-5 rounded-2xl mb-4"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD',
              boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
            }}
          >
            <div className="mb-4">
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#5E6680',
                marginBottom: '0.5rem'
              }}>
                Managing
              </p>
              <div className="space-y-2">
                {userData.conditions.map((condition, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ backgroundColor: '#FBFAF7' }}
                  >
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      fontWeight: 500,
                      color: '#1E2A5E'
                    }}>
                      {condition.name}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: 'rgba(232, 169, 46, 0.15)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#E8A92E'
                      }}
                    >
                      {condition.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: '#E7E4DD' }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#5E6680',
                    marginBottom: '0.25rem'
                  }}>
                    Weight
                  </p>
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#1E2A5E'
                  }}>
                    {userData.weight}kg
                  </p>
                </div>
                <div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#5E6680',
                    marginBottom: '0.25rem'
                  }}>
                    Location
                  </p>
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#1E2A5E'
                  }}>
                    {userData.location.split(',')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Quick Actions */}
          <div className="mb-5">
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={onOpenHealthMetrics}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(110, 154, 110, 0.12)' }}
              >
                <Activity size={24} style={{ color: '#6E9A6E' }} />
              </div>
              <div className="flex-1">
                <p style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  marginBottom: '0.125rem'
                }}>
                  Health Metrics
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#5E6680'
                }}>
                  Track BP, weight, and blood sugar
                </p>
              </div>
            </button>

            <button
              onClick={onOpenCareCircle}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(61, 107, 229, 0.12)' }}
              >
                <Users size={24} style={{ color: '#3D6BE5' }} />
              </div>
              <div className="flex-1">
                <p style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1E2A5E',
                  marginBottom: '0.125rem'
                }}>
                  Care Circle
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#5E6680'
                }}>
                  Manage caregivers and dietitians
                </p>
              </div>
            </button>

            {userData.plan === 'Free' && (
              <button
                onClick={onOpenUpgrade}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  background: 'linear-gradient(135deg, #E8A92E 0%, #F4D27A 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(232, 169, 46, 0.3)',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(30, 42, 94, 0.2)' }}
                >
                  <Crown size={24} style={{ color: '#1E2A5E' }} />
                </div>
                <div className="flex-1">
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1E2A5E',
                    marginBottom: '0.125rem'
                  }}>
                    Upgrade to Care
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#1E2A5E'
                  }}>
                    Unlock all features — ₦1,500/month
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>

          {/* Account Info */}
          <div>
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(168, 188, 240, 0.12)',
              border: '1px solid rgba(168, 188, 240, 0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} style={{ color: '#3D6BE5' }} />
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#1E2A5E'
              }}>
                Member since {userData.joinDate}
              </p>
            </div>
          </div>
          </div>
        </Container>
      </div>
    </div>
  );
};