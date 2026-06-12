import React, { useState } from 'react';
import { X } from 'lucide-react';
import Container from '../layout/Container';

interface LogMetricProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export const LogMetric = ({ onClose, onSave }: LogMetricProps) => {
  const [metricType, setMetricType] = useState<'bp' | 'weight' | 'sugar'>('bp');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weight, setWeight] = useState('');
  const [sugar, setSugar] = useState('');
  const [notes, setNotes] = useState('');

  const isFormValid = () => {
    if (metricType === 'bp') return systolic && diastolic;
    if (metricType === 'weight') return weight;
    if (metricType === 'sugar') return sugar;
    return false;
  };

  const handleSave = () => {
    if (!isFormValid()) return;

    const data = {
      type: metricType,
      value: metricType === 'bp' ? `${systolic}/${diastolic}` : metricType === 'weight' ? weight : sugar,
      notes,
      timestamp: new Date().toISOString()
    };

    onSave(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(30, 42, 94, 0.6)' }}
    >
      <div
        className="w-full rounded-t-3xl pb-8"
        style={{
          backgroundColor: '#FBFAF7',
          maxHeight: '85vh',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b" style={{ borderColor: '#E7E4DD' }}>
          <h2 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1E2A5E'
          }}>
            Log Health Metric
          </h2>
          <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <Container maxWidth="form">
          {/* Metric Type Selection */}
          <div className="mb-6">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              What would you like to log?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMetricType('bp')}
                className="py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: metricType === 'bp' ? '#3D6BE5' : '#FFFFFF',
                  color: metricType === 'bp' ? '#FFFFFF' : '#5E6680',
                  border: `1.5px solid ${metricType === 'bp' ? '#3D6BE5' : '#E7E4DD'}`,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Blood Pressure
              </button>
              <button
                onClick={() => setMetricType('weight')}
                className="py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: metricType === 'weight' ? '#3D6BE5' : '#FFFFFF',
                  color: metricType === 'weight' ? '#FFFFFF' : '#5E6680',
                  border: `1.5px solid ${metricType === 'weight' ? '#3D6BE5' : '#E7E4DD'}`,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Weight
              </button>
              <button
                onClick={() => setMetricType('sugar')}
                className="py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: metricType === 'sugar' ? '#3D6BE5' : '#FFFFFF',
                  color: metricType === 'sugar' ? '#FFFFFF' : '#5E6680',
                  border: `1.5px solid ${metricType === 'sugar' ? '#3D6BE5' : '#E7E4DD'}`,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Blood Sugar
              </button>
            </div>
          </div>

          {/* Blood Pressure Inputs */}
          {metricType === 'bp' && (
            <div className="mb-6">
              <label style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1E2A5E',
                display: 'block',
                marginBottom: '0.75rem'
              }}>
                Blood Pressure Reading
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className="flex-1 px-4 py-3.5 rounded-xl text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E4DD',
                    color: '#1E2A5E',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3D6BE5';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E7E4DD';
                  }}
                />
                <span style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#5E6680'
                }}>
                  /
                </span>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className="flex-1 px-4 py-3.5 rounded-xl text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E4DD',
                    color: '#1E2A5E',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
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
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#5E6680',
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                Systolic / Diastolic (mmHg)
              </p>
            </div>
          )}

          {/* Weight Input */}
          {metricType === 'weight' && (
            <div className="mb-6">
              <label style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1E2A5E',
                display: 'block',
                marginBottom: '0.75rem'
              }}>
                Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="72"
                  className="w-full px-4 py-3.5 pr-16 rounded-xl text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E4DD',
                    color: '#1E2A5E',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3D6BE5';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E7E4DD';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#5E6680'
                }}>
                  kg
                </span>
              </div>
            </div>
          )}

          {/* Blood Sugar Input */}
          {metricType === 'sugar' && (
            <div className="mb-6">
              <label style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1E2A5E',
                display: 'block',
                marginBottom: '0.75rem'
              }}>
                Blood Sugar Level
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                  placeholder="108"
                  className="w-full px-4 py-3.5 pr-20 rounded-xl text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E7E4DD',
                    color: '#1E2A5E',
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3D6BE5';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E7E4DD';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#5E6680'
                }}>
                  mg/dL
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any observations..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl resize-none"
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

          {/* Info */}
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: 'rgba(61, 107, 229, 0.08)',
              border: '1px solid rgba(61, 107, 229, 0.2)'
            }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#1E2A5E',
              lineHeight: 1.5
            }}>
              💡 Track your readings regularly to help your dietitian adjust your meal plan for better health outcomes.
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isFormValid()}
            className="w-full py-4 rounded-xl mb-4 transition-all"
            style={{
              backgroundColor: isFormValid() ? '#3D6BE5' : '#E7E4DD',
              color: isFormValid() ? '#FFFFFF' : '#5E6680',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              boxShadow: isFormValid() ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
            }}
          >
            Save Reading
          </button>
        </Container>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
