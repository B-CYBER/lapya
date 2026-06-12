import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import Container from '../layout/Container';

interface InviteCaregiverProps {
  onClose: () => void;
  onInviteSent: () => void;
}

export const InviteCaregiver = ({ onClose, onInviteSent }: InviteCaregiverProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [sendMethod, setSendMethod] = useState<'sms' | 'whatsapp'>('whatsapp');

  const isFormValid = phoneNumber.length >= 10 && relationship !== '';

  const handleSend = () => {
    if (isFormValid) {
      onInviteSent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(30, 42, 94, 0.6)' }}>
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
            Invite a caregiver
          </h2>
          <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-6">
          <Container maxWidth="form">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#5E6680',
            marginBottom: '1.5rem',
            lineHeight: 1.6
          }}>
            Your caregiver will be able to view your meal plan, help you log meals, and see your grocery list.
          </p>

          {/* Phone Number Input */}
          <div className="mb-5">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Phone number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="080 1234 5678"
              className="w-full px-4 py-3 rounded-xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                color: '#1E2A5E',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
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

          {/* Relationship Dropdown */}
          <div className="mb-6">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 rounded-xl appearance-none"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E7E4DD',
                color: relationship ? '#1E2A5E' : '#5E6680',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                outline: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235E6680' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                paddingRight: '3rem'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3D6BE5';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E7E4DD';
              }}
            >
              <option value="">Select relationship</option>
              <option value="daughter">Daughter</option>
              <option value="son">Son</option>
              <option value="spouse">Spouse</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other family member</option>
            </select>
          </div>

          {/* Send Method */}
          <div className="mb-6">
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              Send invitation via
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setSendMethod('whatsapp')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: sendMethod === 'whatsapp' ? '#3D6BE5' : '#FFFFFF',
                  border: `1.5px solid ${sendMethod === 'whatsapp' ? '#3D6BE5' : '#E7E4DD'}`,
                  color: sendMethod === 'whatsapp' ? '#FFFFFF' : '#1E2A5E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button
                onClick={() => setSendMethod('sms')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: sendMethod === 'sms' ? '#3D6BE5' : '#FFFFFF',
                  border: `1.5px solid ${sendMethod === 'sms' ? '#3D6BE5' : '#E7E4DD'}`,
                  color: sendMethod === 'sms' ? '#FFFFFF' : '#1E2A5E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Send size={18} />
                SMS
              </button>
            </div>
          </div>

          {/* Info Card */}
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
              They'll receive a link to download Lapya and view your profile. You can remove access anytime.
            </p>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!isFormValid}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: isFormValid ? '#3D6BE5' : '#E7E4DD',
              color: isFormValid ? '#FFFFFF' : '#5E6680',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              boxShadow: isFormValid ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
            }}
          >
            Send invitation
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
