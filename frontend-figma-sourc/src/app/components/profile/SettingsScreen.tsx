import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Shield, HelpCircle, FileText, LogOut, Trash2 } from 'lucide-react';
import Container from '../layout/Container';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const settingsSections = [
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Push notifications',
          type: 'toggle' as const,
          value: notificationsEnabled,
          onChange: setNotificationsEnabled
        },
        {
          icon: Bell,
          label: 'Meal reminders',
          type: 'toggle' as const,
          value: mealReminders,
          onChange: setMealReminders,
          description: 'Get reminded before each meal'
        },
        {
          icon: Bell,
          label: 'Weekly progress reports',
          type: 'toggle' as const,
          value: weeklyReports,
          onChange: setWeeklyReports
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          label: 'Privacy policy',
          type: 'link' as const
        },
        {
          icon: Shield,
          label: 'Terms of service',
          type: 'link' as const
        },
        {
          icon: Shield,
          label: 'Data & permissions',
          type: 'link' as const,
          description: 'Manage what data we can access'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help center',
          type: 'link' as const
        },
        {
          icon: HelpCircle,
          label: 'Contact support',
          type: 'link' as const
        },
        {
          icon: FileText,
          label: 'Send feedback',
          type: 'link' as const
        }
      ]
    },
    {
      title: 'About',
      items: [
        {
          icon: FileText,
          label: 'App version',
          type: 'info' as const,
          value: '1.0.0'
        },
        {
          icon: FileText,
          label: 'Licenses',
          type: 'link' as const
        }
      ]
    }
  ];

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
          Settings
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="content">
          {settingsSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#5E6680',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              marginTop: sectionIdx === 0 ? '1.5rem' : '0'
            }}>
              {section.title}
            </h3>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx}>
                  {item.type === 'toggle' ? (
                    <div
                      className="flex items-center justify-between p-4"
                      style={{
                        borderBottom: itemIdx < section.items.length - 1 ? '1px solid #E7E4DD' : 'none'
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <item.icon size={20} style={{ color: '#3D6BE5' }} />
                        <div className="flex-1">
                          <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: '#1E2A5E',
                            marginBottom: item.description ? '0.125rem' : '0'
                          }}>
                            {item.label}
                          </p>
                          {item.description && (
                            <p style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              color: '#5E6680'
                            }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => item.onChange?.(!item.value)}
                        className="relative flex-shrink-0"
                        style={{
                          width: '48px',
                          height: '28px',
                          borderRadius: '14px',
                          backgroundColor: item.value ? '#3D6BE5' : '#E7E4DD',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '2px',
                            left: item.value ? '22px' : '2px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '12px',
                            backgroundColor: '#FFFFFF',
                            transition: 'left 0.2s',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }}
                        />
                      </button>
                    </div>
                  ) : item.type === 'link' ? (
                    <button
                      className="w-full flex items-center justify-between p-4 text-left"
                      style={{
                        borderBottom: itemIdx < section.items.length - 1 ? '1px solid #E7E4DD' : 'none',
                        background: 'none',
                        border: 'none',
                        borderBottom: itemIdx < section.items.length - 1 ? '1px solid #E7E4DD' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <item.icon size={20} style={{ color: '#3D6BE5' }} />
                        <div className="flex-1">
                          <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            fontWeight: 500,
                            color: '#1E2A5E',
                            marginBottom: item.description ? '0.125rem' : '0'
                          }}>
                            {item.label}
                          </p>
                          {item.description && (
                            <p style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              color: '#5E6680'
                            }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={20} style={{ color: '#5E6680' }} />
                    </button>
                  ) : (
                    <div
                      className="flex items-center justify-between p-4"
                      style={{
                        borderBottom: itemIdx < section.items.length - 1 ? '1px solid #E7E4DD' : 'none'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} style={{ color: '#3D6BE5' }} />
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          color: '#1E2A5E'
                        }}>
                          {item.label}
                        </p>
                      </div>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9375rem',
                        color: '#5E6680'
                      }}>
                        {item.value}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="mt-8">
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#5E6680',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            Account
          </h3>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD',
              boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
            }}
          >
            <button
              className="w-full flex items-center gap-3 p-4 text-left"
              style={{
                borderBottom: '1px solid #E7E4DD',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <LogOut size={20} style={{ color: '#B4533A' }} />
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#B4533A'
              }}>
                Log out
              </p>
            </button>

            <button
              className="w-full flex items-center gap-3 p-4 text-left"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={20} style={{ color: '#B4533A' }} />
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: '#B4533A'
              }}>
                Delete account
              </p>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: '#5E6680',
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Lapya helps you eat well with chronic conditions.
            <br />
            Made with 💙 in Nigeria.
          </p>
        </div>
        </div>
        </Container>
      </div>
    </div>
  );
};
