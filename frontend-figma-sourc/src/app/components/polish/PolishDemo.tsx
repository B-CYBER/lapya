import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Toast } from './Toast';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { ConfirmModal } from './ConfirmModal';

interface PolishDemoProps {
  onBack: () => void;
}

export const PolishDemo = ({ onBack }: PolishDemoProps) => {
  const [showToast, setShowToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string>('toasts');

  const demos = [
    { id: 'toasts', label: 'Toasts' },
    { id: 'empty', label: 'Empty States' },
    { id: 'loading', label: 'Loading' },
    { id: 'error', label: 'Error States' },
    { id: 'modal', label: 'Modals' }
  ];

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Toast */}
      {showToast && (
        <Toast
          type={showToast.type}
          message={showToast.message}
          onClose={() => setShowToast(null)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <ConfirmModal
          type="delete"
          title="Delete meal plan?"
          message="This will permanently delete your custom meal plan. This action cannot be undone."
          confirmText="Delete"
          cancelText="Keep it"
          onConfirm={() => {
            setShowModal(false);
            setShowToast({ type: 'success', message: 'Meal plan deleted successfully' });
          }}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
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
          Polish Kit Demo
        </h1>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2 px-6 py-4 overflow-x-auto border-b"
        style={{ borderColor: '#E7E4DD', scrollbarWidth: 'none' }}
      >
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(demo.id)}
            className="px-4 py-2 rounded-lg whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeDemo === demo.id ? '#3D6BE5' : 'transparent',
              color: activeDemo === demo.id ? '#FFFFFF' : '#5E6680',
              border: `1.5px solid ${activeDemo === demo.id ? '#3D6BE5' : '#E7E4DD'}`,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Toasts Demo */}
        {activeDemo === 'toasts' && (
          <div className="px-6 pt-6 space-y-3">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1E2A5E',
              marginBottom: '1rem'
            }}>
              Toast Notifications
            </h3>
            <button
              onClick={() => setShowToast({ type: 'success', message: 'Meal logged successfully!' })}
              className="w-full p-4 rounded-xl text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1E2A5E', fontWeight: 500 }}>
                Show Success Toast
              </p>
            </button>
            <button
              onClick={() => setShowToast({ type: 'error', message: 'Failed to save meal plan' })}
              className="w-full p-4 rounded-xl text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1E2A5E', fontWeight: 500 }}>
                Show Error Toast
              </p>
            </button>
            <button
              onClick={() => setShowToast({ type: 'warning', message: 'Your meal plan needs review' })}
              className="w-full p-4 rounded-xl text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1E2A5E', fontWeight: 500 }}>
                Show Warning Toast
              </p>
            </button>
            <button
              onClick={() => setShowToast({ type: 'info', message: 'New features available!' })}
              className="w-full p-4 rounded-xl text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1E2A5E', fontWeight: 500 }}>
                Show Info Toast
              </p>
            </button>
          </div>
        )}

        {/* Empty States Demo */}
        {activeDemo === 'empty' && (
          <div className="px-6 pt-6 space-y-8">
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem',
                paddingLeft: '0.5rem'
              }}>
                Grocery List Empty
              </h3>
              <EmptyState
                type="grocery"
                title="No items yet"
                description="Your grocery list is empty. Add items from your meal plan to get started."
                actionText="View Meal Plan"
                onAction={() => {}}
              />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem',
                paddingLeft: '0.5rem'
              }}>
                Care Circle Empty
              </h3>
              <EmptyState
                type="careCircle"
                title="No caregivers added"
                description="Invite family or friends to help you manage your meals and stay on track."
                actionText="Invite Caregiver"
                onAction={() => {}}
              />
            </div>
          </div>
        )}

        {/* Loading States Demo */}
        {activeDemo === 'loading' && (
          <div className="px-6 pt-6 space-y-8">
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem'
              }}>
                Loading Spinner
              </h3>
              <LoadingSpinner message="Loading your meal plan..." />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem'
              }}>
                Meal Card Skeleton
              </h3>
              <LoadingSkeleton type="mealCard" />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem'
              }}>
                List Skeleton
              </h3>
              <LoadingSkeleton type="list" />
            </div>
          </div>
        )}

        {/* Error States Demo */}
        {activeDemo === 'error' && (
          <div className="px-6 pt-6 space-y-8">
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem',
                paddingLeft: '0.5rem'
              }}>
                Network Error
              </h3>
              <ErrorState
                title="Connection failed"
                message="Unable to load your meal plan. Please check your internet connection and try again."
                showRetry={true}
                onRetry={() => setShowToast({ type: 'info', message: 'Retrying...' })}
              />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1E2A5E',
                marginBottom: '1rem',
                paddingLeft: '0.5rem'
              }}>
                Generic Error
              </h3>
              <ErrorState
                title="Something went wrong"
                message="We couldn't complete that action. Please try again or go back home."
                showRetry={true}
                showHome={true}
                onRetry={() => {}}
                onGoHome={onBack}
              />
            </div>
          </div>
        )}

        {/* Modals Demo */}
        {activeDemo === 'modal' && (
          <div className="px-6 pt-6 space-y-3">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1E2A5E',
              marginBottom: '1rem'
            }}>
              Confirmation Modals
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="w-full p-4 rounded-xl text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                cursor: 'pointer'
              }}
            >
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#1E2A5E', fontWeight: 500 }}>
                Show Delete Confirmation
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
