import React, { useState } from 'react';
import { Bell, MessageCircle, Home, Calendar, Users, User, Menu, X } from 'lucide-react';
import { LapyaLogo } from '../LapyaLogo';
import Container from '../layout/Container';

interface WebNavigationProps {
  currentScreen: string;
  onNavigateHome: () => void;
  onNavigateToWeek: () => void;
  onOpenCareCircle: () => void;
  onOpenProfile: () => void;
  onOpenScanner: () => void;
  onOpenNotifications: () => void;
  onOpenHealthMetrics?: () => void;
}

export const WebNavigation = ({
  currentScreen,
  onNavigateHome,
  onNavigateToWeek,
  onOpenCareCircle,
  onOpenProfile,
  onOpenScanner,
  onOpenNotifications,
  onOpenHealthMetrics
}: WebNavigationProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: onNavigateHome },
    { id: 'week', label: 'Meal Plan', icon: Calendar, onClick: onNavigateToWeek },
    { id: 'careCircle', label: 'Care Circle', icon: Users, onClick: onOpenCareCircle },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E7E4DD',
          height: '64px'
        }}
      >
        <Container maxWidth="dashboard">
          <div className="h-full flex items-center justify-between">
            {/* Left: Logo + Menu (mobile) */}
            <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1E2A5E'
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <LapyaLogo size={36} onDark={false} />
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? '#F0F4FE' : 'transparent',
                    color: isActive ? '#3D6BE5' : '#5E6680',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenScanner}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: '#3D6BE5',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <MessageCircle size={18} />
              <span>Ask AI</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-2 relative"
              style={{
                color: '#1E2A5E',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Bell size={22} />
              <div
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#E8A92E' }}
              />
            </button>

            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-full"
              style={{
                backgroundColor: '#A8BCF0',
                border: 'none',
                cursor: 'pointer'
              }}
            />
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E7E4DD'
        }}
      >
        <div className="p-6">
          <div className="mb-8">
            <LapyaLogo size={40} onDark={false} />
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? '#F0F4FE' : 'transparent',
                    color: isActive ? '#3D6BE5' : '#5E6680',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6">
            <button
              onClick={() => {
                onOpenScanner();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#3D6BE5',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              <MessageCircle size={18} />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};