import React from 'react';
import { ChevronLeft, UserPlus, MoreVertical, Crown, Heart, Stethoscope } from 'lucide-react';
import Container from '../layout/Container';

interface CareCircleProps {
  onBack: () => void;
  onInviteCaregiver?: () => void;
  onInviteDietitian?: () => void;
  members?: CircleMember[];
}

interface CircleMember {
  name: string;
  role: string;
  icon: typeof Crown;
  iconColor: string;
  badgeColor: string;
  phone: string;
  joinedDate: string;
  canRemove: boolean;
  relationship?: string;
  clinic?: string;
}

export const CareCircle = ({ onBack, onInviteCaregiver, onInviteDietitian, members }: CareCircleProps) => {
  const circlemembers: CircleMember[] = members ?? [
    {
      name: 'You',
      role: 'Patient',
      icon: Crown,
      iconColor: '#E8A92E',
      badgeColor: '#E8A92E',
      phone: '080 1234 5678',
      joinedDate: 'Account owner',
      canRemove: false
    },
    {
      name: 'Chioma',
      role: 'Caregiver',
      icon: Heart,
      iconColor: '#3D6BE5',
      badgeColor: '#3D6BE5',
      phone: '081 9876 5432',
      relationship: 'Daughter',
      joinedDate: 'Added May 15, 2026',
      canRemove: true
    }
  ];

  const hasCaregiver = circlemembers.some(m => m.role === 'Caregiver');
  const hasDietitian = circlemembers.some(m => m.role === 'Dietitian');

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <Container maxWidth="content" noPadding>
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
            Care Circle
          </h1>
          <div className="w-10" />
        </div>
      </Container>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="content">
          {/* Header Section */}
          <div className="pt-6 pb-4">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#5E6680',
            lineHeight: 1.6
          }}>
            People who cook for you or buy your groceries. They see your meal plan and grocery list so they always know what to prepare.
          </p>

          {/* Members List */}
          <div className="space-y-3 mb-6">
          {circlemembers.map((member, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar with role icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${member.iconColor}20` }}
                  >
                    <member.icon size={24} style={{ color: member.iconColor }} />
                  </div>
                  {/* Role badge */}
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: member.badgeColor,
                      border: '2px solid #FFFFFF'
                    }}
                  >
                    {member.role === 'Patient' && (
                      <Crown size={12} style={{ color: '#FFFFFF' }} />
                    )}
                    {member.role === 'Caregiver' && (
                      <Heart size={12} style={{ color: '#FFFFFF' }} />
                    )}
                    {member.role === 'Dietitian' && (
                      <Stethoscope size={12} style={{ color: '#FFFFFF' }} />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '1.0625rem',
                        fontWeight: 600,
                        color: '#1E2A5E',
                        marginBottom: '0.125rem'
                      }}>
                        {member.name}
                      </h3>
                      <div
                        className="inline-block px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${member.badgeColor}15` }}
                      >
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: member.badgeColor
                        }}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    {member.canRemove && (
                      <button
                        className="p-1"
                        style={{
                          color: '#5E6680',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <MoreVertical size={20} />
                      </button>
                    )}
                  </div>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#5E6680',
                    marginTop: '0.5rem'
                  }}>
                    {member.phone}
                  </p>

                  {member.relationship && (
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#5E6680',
                      marginTop: '0.25rem'
                    }}>
                      {member.relationship}
                    </p>
                  )}

                  {member.clinic && (
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#5E6680',
                      marginTop: '0.25rem'
                    }}>
                      {member.clinic}
                    </p>
                  )}

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#A8BCF0',
                    marginTop: '0.5rem'
                  }}>
                    {member.joinedDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Add Members Section */}
          <div>
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Add to your circle
          </h3>

          <div className="space-y-3">
            {/* Add Caregiver */}
            {!hasCaregiver && (
              <button
                onClick={onInviteCaregiver}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px dashed #3D6BE5',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(61, 107, 229, 0.12)' }}
                >
                  <UserPlus size={24} style={{ color: '#3D6BE5' }} />
                </div>
                <div className="flex-1">
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#1E2A5E',
                    marginBottom: '0.125rem'
                  }}>
                    Add caregiver
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#5E6680'
                  }}>
                    Person who cooks or shops for you
                  </p>
                </div>
              </button>
            )}

          </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(168, 188, 240, 0.12)',
              border: '1px solid rgba(168, 188, 240, 0.3)'
            }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#1E2A5E',
              lineHeight: 1.5
            }}>
              🔒 Your health data is private. Only people you invite can see your information. You can remove anyone at any time.
            </p>
          </div>
          </div>
          </div>
        </Container>
      </div>
    </div>
  );
};