import React, { useState } from 'react';
import { Bell, Search, Calendar, TrendingUp, AlertCircle, UserPlus } from 'lucide-react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface DashboardPatient {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  adherence: number;
  lastLog: string;
  status: string;
  alerts: number;
  avatar: string;
}

interface DietitianDashboardProps {
  onPatientClick?: (patientId: string) => void;
  onInviteClick?: () => void;
  patients?: DashboardPatient[];
}

export const DietitianDashboard = ({ onPatientClick, onInviteClick, patients: patientsProp }: DietitianDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'attention'>('all');

  const patients: DashboardPatient[] = patientsProp ?? [
    {
      id: '1',
      name: 'Mrs. Adebayo',
      age: 58,
      conditions: ['Diabetes', 'Hypertension'],
      adherence: 92,
      lastLog: '2 hours ago',
      status: 'active',
      alerts: 0,
      avatar: '#A8BCF0'
    },
    {
      id: '2',
      name: 'Mr. Okonkwo',
      age: 64,
      conditions: ['Kidney Disease', 'High BP'],
      adherence: 78,
      lastLog: '1 day ago',
      status: 'attention',
      alerts: 2,
      avatar: '#E8A92E'
    },
    {
      id: '3',
      name: 'Mrs. Nwankwo',
      age: 52,
      conditions: ['Weight Management', 'Anxiety'],
      adherence: 88,
      lastLog: '5 hours ago',
      status: 'active',
      alerts: 0,
      avatar: '#6E9A6E'
    },
    {
      id: '4',
      name: 'Mr. Bello',
      age: 61,
      conditions: ['Diabetes', 'Heart Disease', 'High Cholesterol'],
      adherence: 65,
      lastLog: '3 days ago',
      status: 'attention',
      alerts: 3,
      avatar: '#B4533A'
    },
    {
      id: '5',
      name: 'Mrs. Ibrahim',
      age: 55,
      conditions: ['Fatty Liver', 'GERD'],
      adherence: 95,
      lastLog: '30 minutes ago',
      status: 'active',
      alerts: 0,
      avatar: '#3D6BE5'
    }
  ];

  const filteredPatients = patients.filter(patient => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return patient.status === 'active' && patient.adherence >= 80;
    if (activeTab === 'attention') return patient.alerts > 0 || patient.adherence < 80;
    return true;
  });

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: '#FBFAF7' }}>
        <LapyaLogo size={32} onDark={false} />
        <div className="flex items-center gap-4">
          {onInviteClick && (
            <button
              onClick={onInviteClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: '#3D6BE5',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={16} />
              Invite
            </button>
          )}
          <button className="p-2" style={{ color: '#1E2A5E' }}>
            <Bell size={22} />
          </button>
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#6E9A6E' }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <Container maxWidth="dashboard">
          {/* Header */}
          <div className="pt-4 pb-6">
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '2rem',
            fontWeight: 600,
            color: '#1E2A5E',
            marginBottom: '0.5rem'
          }}>
            My Patients
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#5E6680'
          }}>
            {filteredPatients.length} {activeTab === 'all' ? 'total' : activeTab} patient{filteredPatients.length !== 1 ? 's' : ''}
          </p>
        </div>

          {/* Stats Cards */}
          <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} style={{ color: '#6E9A6E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '0.125rem'
              }}>
                {patients.filter(p => p.adherence >= 80).length}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#5E6680'
              }}>
                On track
              </p>
            </div>

            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} style={{ color: '#C9892E' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '0.125rem'
              }}>
                {patients.filter(p => p.alerts > 0 || p.adherence < 80).length}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#5E6680'
              }}>
                Need attention
              </p>
            </div>

            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} style={{ color: '#3D6BE5' }} />
              </div>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '0.125rem'
              }}>
                {patients.length}
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#5E6680'
              }}>
                Total
              </p>
            </div>
          </div>
        </div>

          {/* Search */}
          <div className="mb-5">
          <div className="relative">
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#5E6680'
              }}
            />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-12 pr-4 py-3 rounded-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                color: '#1E2A5E',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3D6BE5';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E7E4DD';
              }}
            />
          </div>
        </div>

          {/* Filter Tabs */}
          <div className="mb-5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'all' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'all' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'all' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'active' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'active' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'active' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('attention')}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: activeTab === 'attention' ? '#3D6BE5' : 'transparent',
                color: activeTab === 'attention' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeTab === 'attention' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Needs Attention
            </button>
          </div>
        </div>

          {/* Patient List */}
          <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onPatientClick?.(patient.id)}
              className="w-full p-5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: patient.avatar }}
                >
                  <span style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    {patient.name.split(' ')[0][0]}{patient.name.split(' ')[1]?.[0] || ''}
                  </span>
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
                        {patient.name}
                      </h3>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8125rem',
                        color: '#5E6680'
                      }}>
                        {patient.age} years old
                      </p>
                    </div>
                    {patient.alerts > 0 && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(201, 137, 46, 0.15)' }}
                      >
                        <AlertCircle size={12} style={{ color: '#C9892E' }} />
                        <span style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: '#C9892E'
                        }}>
                          {patient.alerts}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conditions */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {patient.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: 'rgba(61, 107, 229, 0.1)',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: '#3D6BE5'
                        }}
                      >
                        {condition}
                      </span>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-12 h-1.5 rounded-full"
                        style={{ backgroundColor: '#E7E4DD' }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            backgroundColor: patient.adherence >= 80 ? '#6E9A6E' : '#C9892E',
                            width: `${patient.adherence}%`
                          }}
                        />
                      </div>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: patient.adherence >= 80 ? '#6E9A6E' : '#C9892E'
                      }}>
                        {patient.adherence}%
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680'
                    }}>
                      Last log: {patient.lastLog}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
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
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#3D6BE5' }} />
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <Calendar size={24} style={{ color: '#5E6680' }} />
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <div style={{ color: '#5E6680' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
        </button>

        <button className="flex flex-col items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
          <div style={{ color: '#5E6680' }}>
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
