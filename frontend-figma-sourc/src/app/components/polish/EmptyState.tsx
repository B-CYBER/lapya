import React from 'react';
import { ShoppingCart, Users, Calendar, FileText, Utensils } from 'lucide-react';

interface EmptyStateProps {
  type: 'grocery' | 'careCircle' | 'meals' | 'history' | 'generic';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState = ({ type, title, description, actionText, onAction }: EmptyStateProps) => {
  const icons = {
    grocery: ShoppingCart,
    careCircle: Users,
    meals: Utensils,
    history: Calendar,
    generic: FileText
  };

  const Icon = icons[type];

  return (
    <div className="flex flex-col items-center justify-center px-8 py-16">
      {/* Icon Circle */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'rgba(168, 188, 240, 0.15)',
          border: '2px dashed rgba(168, 188, 240, 0.4)'
        }}
      >
        <Icon size={40} style={{ color: '#A8BCF0' }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Sora, sans-serif',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#1E2A5E',
        marginBottom: '0.5rem',
        textAlign: 'center'
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.9375rem',
        color: '#5E6680',
        lineHeight: 1.6,
        textAlign: 'center',
        marginBottom: actionText ? '1.5rem' : '0',
        maxWidth: '280px'
      }}>
        {description}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: '#3D6BE5',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(61, 107, 229, 0.2)'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
