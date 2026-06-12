import React, { useState } from 'react';
import { ChevronLeft, Camera, User } from 'lucide-react';
import Container from '../layout/Container';

interface EditProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
}

interface EditProfileProps {
  onBack: () => void;
  onSave: (data: EditProfileFormData) => void;
  initial?: Partial<EditProfileFormData>;
  isSubmitting?: boolean;
}

export const EditProfile = ({ onBack, onSave, initial, isSubmitting }: EditProfileProps) => {
  const [formData, setFormData] = useState<EditProfileFormData>({
    firstName: initial?.firstName ?? 'Ngozi',
    lastName: initial?.lastName ?? 'Okafor',
    email: initial?.email ?? 'ngozi.okafor@email.com',
    phone: initial?.phone ?? '+234 803 456 7890',
    dateOfBirth: initial?.dateOfBirth ?? '1958-03-15',
    address: initial?.address ?? '12 Allen Avenue, Ikeja, Lagos'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
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
          Edit Profile
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="form">
          {/* Profile Photo */}
          <div className="flex flex-col items-center py-8">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#A8BCF0',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(30, 42, 94, 0.1)'
              }}
            >
              <User size={48} style={{ color: '#FFFFFF' }} />
            </div>
            <button
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#3D6BE5',
                border: '3px solid #FBFAF7',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(61, 107, 229, 0.3)'
              }}
            >
              <Camera size={18} style={{ color: '#FFFFFF' }} />
            </button>
          </div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: '#5E6680',
            marginTop: '0.75rem'
          }}>
            Tap to change profile photo
          </p>
        </div>

          {/* Form Fields */}
          <div className="space-y-5">
          {/* First Name */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl"
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

          {/* Last Name */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl"
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

          {/* Email */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl"
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

          {/* Phone */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl"
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

          {/* Date of Birth */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl"
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

          {/* Address */}
          <div>
            <label style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSubmitting}
            className="w-full py-4 rounded-xl mt-8"
            style={{
              backgroundColor: hasChanges && !isSubmitting ? '#3D6BE5' : '#E7E4DD',
              color: hasChanges && !isSubmitting ? '#FFFFFF' : '#5E6680',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: hasChanges && !isSubmitting ? 'pointer' : 'not-allowed',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: hasChanges && !isSubmitting ? '0 4px 16px rgba(61, 107, 229, 0.2)' : 'none'
            }}
          >
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
        </Container>
      </div>
    </div>
  );
};
