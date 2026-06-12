import React, { useState } from 'react';
import { ChevronLeft, Bell, Clock, CheckCircle2, AlertCircle, Calendar, Users, Settings } from 'lucide-react';
import Container from '../layout/Container';

interface NotificationRow {
  id: string;
  type: string;
  icon: typeof Clock;
  iconColor: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsListProps {
  onBack: () => void;
  onOpenSettings?: () => void;
  notifications?: NotificationRow[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export const NotificationsList = ({ onBack, onOpenSettings, notifications: notificationsProp, onMarkRead, onMarkAllRead }: NotificationsListProps) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications: NotificationRow[] = notificationsProp ?? [
    {
      id: '1',
      type: 'reminder',
      icon: Clock,
      iconColor: '#3D6BE5',
      iconBg: 'rgba(61, 107, 229, 0.12)',
      title: 'Time for lunch',
      message: 'Brown Rice & Garden Egg Stew is ready on your plan',
      time: '15 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle2,
      iconColor: '#6E9A6E',
      iconBg: 'rgba(110, 154, 110, 0.12)',
      title: 'Great progress!',
      message: 'You have logged meals 5 days in a row. Keep it up!',
      time: '2 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'caregiver',
      icon: Users,
      iconColor: '#E8A92E',
      iconBg: 'rgba(232, 169, 46, 0.12)',
      title: 'Chioma logged your breakfast',
      message: 'Moin Moin + Pap was logged at 8:15 AM',
      time: '4 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'alert',
      icon: AlertCircle,
      iconColor: '#C9892E',
      iconBg: 'rgba(201, 137, 46, 0.12)',
      title: 'Update your weight',
      message: 'It has been 2 weeks since your last weight check',
      time: '1 day ago',
      read: true
    },
    {
      id: '5',
      type: 'reminder',
      icon: Calendar,
      iconColor: '#3D6BE5',
      iconBg: 'rgba(61, 107, 229, 0.12)',
      title: 'Weekly meal plan ready',
      message: 'Your new meal plan for next week is available',
      time: '2 days ago',
      read: true
    },
    {
      id: '6',
      type: 'alert',
      icon: Bell,
      iconColor: '#C9892E',
      iconBg: 'rgba(201, 137, 46, 0.12)',
      title: 'Grocery list updated',
      message: '5 new items added based on your meal plan',
      time: '2 days ago',
      read: true
    },
    {
      id: '7',
      type: 'success',
      icon: CheckCircle2,
      iconColor: '#6E9A6E',
      iconBg: 'rgba(110, 154, 110, 0.12)',
      title: 'BP reading recorded',
      message: 'Your blood pressure of 128/82 has been saved',
      time: '3 days ago',
      read: true
    }
  ];

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

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
          Notifications
        </h1>
        <button onClick={onOpenSettings} className="p-2" style={{ color: '#1E2A5E' }}>
          <Settings size={22} />
        </button>
      </div>

      {/* Mark all read */}
      {unreadCount > 0 && onMarkAllRead && (
        <div className="px-6 pt-3 flex justify-end">
          <button
            onClick={onMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              color: '#3D6BE5',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Mark all read
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-6 py-4 border-b" style={{ borderColor: '#E7E4DD' }}>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: filter === 'all' ? '#3D6BE5' : 'transparent',
              color: filter === 'all' ? '#FFFFFF' : '#5E6680',
              border: `1.5px solid ${filter === 'all' ? '#3D6BE5' : '#E7E4DD'}`,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className="px-4 py-2 rounded-lg transition-all relative"
            style={{
              backgroundColor: filter === 'unread' ? '#3D6BE5' : 'transparent',
              color: filter === 'unread' ? '#FFFFFF' : '#5E6680',
              border: `1.5px solid ${filter === 'unread' ? '#3D6BE5' : '#E7E4DD'}`,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Unread
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#E8A92E',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#FFFFFF'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <Container maxWidth="content">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: 'rgba(168, 188, 240, 0.15)',
                border: '2px dashed rgba(168, 188, 240, 0.4)'
              }}
            >
              <Bell size={40} style={{ color: '#A8BCF0' }} />
            </div>
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#1E2A5E',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              No unread notifications
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#5E6680',
              lineHeight: 1.6,
              textAlign: 'center'
            }}>
              You are all caught up!
            </p>
            </div>
          ) : (
            <div className="py-4 space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.read) onMarkRead?.(notification.id);
                }}
                className="p-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: notification.read ? '#FFFFFF' : 'rgba(61, 107, 229, 0.04)',
                  border: `1px solid ${notification.read ? '#E7E4DD' : 'rgba(61, 107, 229, 0.2)'}`,
                  boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                  cursor: notification.read ? 'default' : 'pointer'
                }}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: notification.iconBg }}
                  >
                    <notification.icon size={20} style={{ color: notification.iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#1E2A5E'
                      }}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: '#3D6BE5' }}
                        />
                      )}
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      color: '#5E6680',
                      lineHeight: 1.5,
                      marginBottom: '0.5rem'
                    }}>
                      {notification.message}
                    </p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#A8BCF0'
                    }}>
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};
