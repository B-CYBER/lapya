import React, { useState } from 'react';
import { ChevronLeft, Edit3, Check, X, AlertCircle, TrendingUp, Calendar, Pencil } from 'lucide-react';
import Container from '../layout/Container';

interface DetailPatient {
  name: string;
  age: number;
  weight: number;
  conditions: { name: string; severity: string }[];
  location: string;
  adherence: number;
  lastBP: string;
  lastBPDate: string;
}

interface DetailMeal {
  itemId?: number;
  type: string;
  name: string;
  calories: number;
  safe: boolean;
  editedByName?: string | null;
  dietitianNote?: string | null;
}

interface DetailDayPlan {
  day: string;
  meals: DetailMeal[];
}

interface DetailActivity {
  date: string;
  action: string;
  status: string;
}

interface DetailNote {
  id: number;
  body: string;
  dietitianName: string | null;
  createdAt: string;
}

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
  patient?: DetailPatient;
  weeklyPlan?: DetailDayPlan[];
  recentActivity?: DetailActivity[];
  notes?: DetailNote[];
  onSwapMeal?: (itemId: number) => void;
  onAddNote?: (body: string) => Promise<void> | void;
  onSendPlan?: () => void;
  sendPlanPending?: boolean;
}

export const PatientDetail = ({
  patientId,
  onBack,
  patient: patientProp,
  weeklyPlan: weeklyPlanProp,
  recentActivity: recentActivityProp,
  notes,
  onSwapMeal,
  onAddNote,
  onSendPlan,
  sendPlanPending,
}: PatientDetailProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'notes' | 'history'>('overview');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Mock patient data fallback
  const patient: DetailPatient = patientProp ?? {
    name: 'Mrs. Adebayo',
    age: 58,
    weight: 72,
    conditions: [
      { name: 'Type 2 Diabetes', severity: 'Moderate' },
      { name: 'Hypertension', severity: 'Mild' }
    ],
    location: 'Lagos, South West',
    adherence: 92,
    lastBP: '130/85',
    lastBPDate: 'May 15, 2026'
  };

  const weeklyPlan: DetailDayPlan[] = weeklyPlanProp ?? [
    {
      day: 'Monday',
      meals: [
        { type: 'Breakfast', name: 'Moin Moin + Pap', calories: 320, safe: true },
        { type: 'Lunch', name: 'Brown Rice & Vegetable Soup', calories: 450, safe: true },
        { type: 'Dinner', name: 'Grilled Fish + Plantain', calories: 380, safe: true }
      ]
    },
    {
      day: 'Tuesday',
      meals: [
        { type: 'Breakfast', name: 'Oats + Boiled Egg', calories: 280, safe: true },
        { type: 'Lunch', name: 'Beans & Plantain', calories: 420, safe: true },
        { type: 'Dinner', name: 'Okra Soup + Small Eba', calories: 350, safe: false }
      ]
    }
  ];

  const recentActivity: DetailActivity[] = recentActivityProp ?? [
    { date: '2 hours ago', action: 'Logged Breakfast: Moin Moin + Pap', status: 'success' },
    { date: '1 day ago', action: 'Logged Lunch: Brown Rice & Stew', status: 'success' },
    { date: '1 day ago', action: 'Missed Dinner', status: 'warning' },
    { date: '2 days ago', action: 'Updated weight: 72kg', status: 'info' }
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
          fontSize: '1.125rem',
          fontWeight: 700,
          color: '#1E2A5E'
        }}>
          Patient Details
        </h1>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="p-2"
          style={{ color: isEditMode ? '#6E9A6E' : '#3D6BE5' }}
        >
          {isEditMode ? <Check size={22} /> : <Edit3 size={22} />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="dashboard">
          {/* Patient Header Card */}
          <div className="mt-6 mb-5 p-6 rounded-3xl" style={{ backgroundColor: '#1E2A5E' }}>
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <span style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                MA
              </span>
            </div>
            <div className="flex-1">
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#F4D27A',
                marginBottom: '0.25rem'
              }}>
                {patient.name}
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#A8BCF0',
                marginBottom: '0.5rem'
              }}>
                {patient.age} years old • {patient.weight}kg
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-16 h-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(168, 188, 240, 0.3)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: '#E8A92E',
                      width: `${patient.adherence}%`
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#E8A92E'
                }}>
                  {patient.adherence}% adherence
                </span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-2">
            {patient.conditions.map((condition, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(168, 188, 240, 0.15)' }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#F4F1EA'
                }}>
                  {condition.name}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: 'rgba(232, 169, 46, 0.2)',
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

          {/* Tabs */}
          <div className="mb-5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'overview' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'overview' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'overview' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'plan' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'plan' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'plan' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Meal Plan
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'notes' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'notes' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'notes' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'history' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'history' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'history' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              History
            </button>
          </div>
        </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
            {/* Health Metrics */}
            <div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem'
              }}>
                Latest Health Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#5E6680',
                    marginBottom: '0.25rem'
                  }}>
                    Blood Pressure
                  </p>
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1E2A5E',
                    marginBottom: '0.125rem'
                  }}>
                    {patient.lastBP}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6875rem',
                    color: '#5E6680'
                  }}>
                    {patient.lastBPDate}
                  </p>
                </div>

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
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1E2A5E',
                    marginBottom: '0.125rem'
                  }}>
                    {patient.weight}kg
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6875rem',
                    color: '#6E9A6E'
                  }}>
                    -2kg this month
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem'
              }}>
                Recent Activity
              </h3>

              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          activity.status === 'success' ? 'rgba(110, 154, 110, 0.15)' :
                          activity.status === 'warning' ? 'rgba(201, 137, 46, 0.15)' :
                          'rgba(61, 107, 229, 0.15)'
                      }}
                    >
                      {activity.status === 'success' && <Check size={16} style={{ color: '#6E9A6E' }} />}
                      {activity.status === 'warning' && <AlertCircle size={16} style={{ color: '#C9892E' }} />}
                      {activity.status === 'info' && <TrendingUp size={16} style={{ color: '#3D6BE5' }} />}
                    </div>
                    <div className="flex-1">
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#1E2A5E',
                        marginBottom: '0.125rem'
                      }}>
                        {activity.action}
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: '#5E6680'
                      }}>
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'rgba(61, 107, 229, 0.08)',
                border: '1px solid rgba(61, 107, 229, 0.2)'
              }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#1E2A5E'
              }}>
                📍 Location: <strong>{patient.location}</strong>
              </p>
            </div>
            </div>
          )}

          {/* Meal Plan Tab */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
            {isEditMode && (
              <div
                className="p-4 rounded-xl mb-4"
                style={{
                  backgroundColor: 'rgba(232, 169, 46, 0.12)',
                  border: '1px solid rgba(232, 169, 46, 0.3)'
                }}
              >
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#1E2A5E',
                  lineHeight: 1.5
                }}>
                  ✏️ <strong>Edit mode active.</strong> Tap any meal to swap or adjust portions. Changes will notify the patient.
                </p>
              </div>
            )}

            {weeklyPlan.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E4DD',
                  boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
                }}
              >
                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1E2A5E',
                  marginBottom: '1rem'
                }}>
                  {day.day}
                </h3>

                <div className="space-y-3">
                  {day.meals.map((meal, mealIdx) => (
                    <div
                      key={mealIdx}
                      className="flex items-start justify-between p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: isEditMode ? '#FBFAF7' : 'transparent',
                        border: isEditMode ? '1.5px dashed #3D6BE5' : '1px solid #E7E4DD',
                        cursor: isEditMode && meal.itemId ? 'pointer' : 'default'
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: '#3D6BE5',
                            letterSpacing: '0.5px'
                          }}>
                            {meal.type.toUpperCase()}
                          </span>
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: meal.safe ? '#6E9A6E' : '#C9892E' }}
                          />
                          {meal.editedByName && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: 'rgba(61, 107, 229, 0.12)',
                                color: '#3D6BE5',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                              }}
                            >
                              <Pencil size={10} />
                              Edited by Dr. {meal.editedByName}
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          color: '#1E2A5E',
                          marginBottom: '0.25rem'
                        }}>
                          {meal.name}
                        </p>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          color: '#5E6680'
                        }}>
                          {meal.calories} cal
                        </p>
                        {meal.dietitianNote && (
                          <p
                            className="mt-2 p-2 rounded-md"
                            style={{
                              backgroundColor: 'rgba(232, 169, 46, 0.08)',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.75rem',
                              color: '#1E2A5E',
                              fontStyle: 'italic'
                            }}
                          >
                            “{meal.dietitianNote}”
                          </p>
                        )}
                      </div>
                      {isEditMode && meal.itemId && onSwapMeal && (
                        <button
                          onClick={() => onSwapMeal(meal.itemId!)}
                          className="px-3 py-1.5 rounded-lg"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #3D6BE5',
                            color: '#3D6BE5',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Swap
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {onSendPlan && (
              <button
                onClick={onSendPlan}
                disabled={sendPlanPending}
                className="w-full py-4 rounded-xl transition-all"
                style={{
                  backgroundColor: '#3D6BE5',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: sendPlanPending ? 'wait' : 'pointer',
                  opacity: sendPlanPending ? 0.6 : 1,
                  boxShadow: '0 4px 16px rgba(61, 107, 229, 0.2)'
                }}
              >
                {sendPlanPending ? 'Sending…' : `Send plan to ${patient.name.split(' ')[0]}`}
              </button>
            )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E4DD',
                  boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
                }}
              >
                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1E2A5E',
                  marginBottom: '1rem'
                }}>
                  Add a note
                </h3>
                <textarea
                  value={newNoteBody}
                  onChange={(e) => setNewNoteBody(e.target.value)}
                  placeholder="What would you like to remind this patient about?"
                  rows={3}
                  className="w-full p-3 rounded-xl resize-none"
                  style={{
                    border: '1px solid #E7E4DD',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#1E2A5E',
                    backgroundColor: '#FBFAF7'
                  }}
                />
                <button
                  onClick={async () => {
                    if (!onAddNote || !newNoteBody.trim()) return;
                    setNoteSubmitting(true);
                    try {
                      await onAddNote(newNoteBody.trim());
                      setNewNoteBody('');
                    } finally {
                      setNoteSubmitting(false);
                    }
                  }}
                  disabled={!newNoteBody.trim() || noteSubmitting}
                  className="mt-3 px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: '#3D6BE5',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    border: 'none',
                    cursor: newNoteBody.trim() && !noteSubmitting ? 'pointer' : 'not-allowed',
                    opacity: newNoteBody.trim() && !noteSubmitting ? 1 : 0.5
                  }}
                >
                  {noteSubmitting ? 'Saving…' : 'Save note'}
                </button>
              </div>

              {(notes ?? []).length === 0 ? (
                <p
                  className="text-center p-6 rounded-2xl"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px dashed #E7E4DD',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#5E6680'
                  }}
                >
                  No notes yet.
                </p>
              ) : (
                (notes ?? []).map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E7E4DD',
                      boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#3D6BE5'
                      }}>
                        {note.dietitianName ? `Dr. ${note.dietitianName}` : 'Dietitian'}
                      </span>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.6875rem',
                        color: '#5E6680'
                      }}>
                        {new Date(note.createdAt).toLocaleDateString('en-GB', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#1E2A5E',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {note.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
            <div
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1E2A5E'
                }}>
                  7-Day Adherence
                </h3>
                <span style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#6E9A6E'
                }}>
                  92%
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {[85, 90, 88, 95, 92, 87, 92].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${value}%`,
                        backgroundColor: value >= 80 ? '#6E9A6E' : '#C9892E'
                      }}
                    />
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.6875rem',
                      color: '#5E6680'
                    }}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#E7E4DD' }}>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680',
                      marginBottom: '0.25rem'
                    }}>
                      Meals logged
                    </p>
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1E2A5E'
                    }}>
                      19/21
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680',
                      marginBottom: '0.25rem'
                    }}>
                      On time
                    </p>
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#1E2A5E'
                    }}>
                      92%
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680',
                      marginBottom: '0.25rem'
                    }}>
                      Streak
                    </p>
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#E8A92E'
                    }}>
                      4 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
