import React, { useState } from 'react';
import { ChevronLeft, Filter, Sparkles } from 'lucide-react';
import Container from '../layout/Container';

interface WeekDay {
  short: string;
  date: string;
  full: string;
}

interface WeekViewMeal {
  itemId?: number;
  time: string;
  type: string;
  name: string;
  localName?: string;
  image: string;
  portion: string;
  safety: string[];
}

interface WeekViewProps {
  onMealClick: (meal: any) => void;
  onBack: () => void;
  userPlan?: 'free' | 'care';
  days?: WeekDay[];
  mealsByDay?: Record<string, WeekViewMeal[]>;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const WeekView = ({
  onMealClick,
  onBack,
  userPlan = 'free',
  days: daysProp,
  mealsByDay,
  onRegenerate,
  isRegenerating,
}: WeekViewProps) => {
  const [selectedDay, setSelectedDay] = useState(daysProp?.[0]?.short ?? 'Mon');

  const allDays: WeekDay[] = daysProp ?? [
    { short: 'Mon', date: '18', full: 'Monday' },
    { short: 'Tue', date: '19', full: 'Tuesday' },
    { short: 'Wed', date: '20', full: 'Wednesday' },
    { short: 'Thu', date: '21', full: 'Thursday' },
    { short: 'Fri', date: '22', full: 'Friday' },
    { short: 'Sat', date: '23', full: 'Saturday' },
    { short: 'Sun', date: '24', full: 'Sunday' }
  ];

  // Free users only see Monday-Friday
  const days = userPlan === 'free' ? allDays.slice(0, 5) : allDays;

  const meals: WeekViewMeal[] = mealsByDay?.[selectedDay] ?? [
    {
      time: '7:00 AM',
      type: 'Breakfast',
      name: 'Akara & Pap',
      localName: 'Bean Cake & Ogi',
      image: 'https://images.unsplash.com/photo-1647162264554-5f60af27f052?w=800&q=80',
      portion: '4 pieces + 1 cup',
      safety: ['safe', 'safe']
    },
    {
      time: '1:00 PM',
      type: 'Lunch',
      name: 'Grilled Fish & Plantain',
      localName: 'Eja Dindin',
      image: 'https://images.unsplash.com/photo-1665401015549-712c0dc5ef85?w=800&q=80',
      portion: '1 medium fish + 1 small plantain',
      safety: ['safe', 'safe']
    },
    {
      time: '6:30 PM',
      type: 'Dinner',
      name: 'Vegetable Soup & Eba',
      localName: 'Efo Riro',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
      portion: '1 hand-fistful eba',
      safety: ['caution', 'safe']
    },
    {
      time: '4:00 PM',
      type: 'Snack',
      name: 'Garden Egg & Groundnut',
      localName: 'Igba & Epa',
      image: 'https://images.unsplash.com/photo-1664993090321-b2caff794431?w=800&q=80',
      portion: '1 cup',
      safety: ['safe', 'safe']
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: '#FBFAF7' }}>
      <Container maxWidth="content" className="py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#1E2A5E'
          }}>
            Your Week
          </h1>
          <button className="p-2 rounded-lg transition-all hover:bg-white" style={{ color: '#1E2A5E', border: 'none', cursor: 'pointer' }}>
            <Filter size={22} />
          </button>
        </div>

        {/* Day Selector Strip */}
        <div className="mb-6">
        <div className="flex gap-2 justify-start md:justify-center overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {days.map((day) => {
            const isSelected = selectedDay === day.short;
            const isToday = day.short === 'Mon';

            return (
              <button
                key={day.short}
                onClick={() => setSelectedDay(day.short)}
                className="flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: isSelected ? '#3D6BE5' : '#FFFFFF',
                  border: `1px solid ${isSelected ? '#3D6BE5' : '#E7E4DD'}`,
                  minWidth: '60px'
                }}
              >
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: isSelected ? '#FFFFFF' : '#5E6680',
                  marginBottom: '0.25rem'
                }}>
                  {day.short}
                </p>
                <p style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: isSelected ? '#FFFFFF' : '#1E2A5E'
                }}>
                  {day.date}
                </p>
                {isToday && (
                  <div
                    className="mt-1 w-1 h-1 rounded-full"
                    style={{ backgroundColor: isSelected ? '#F4D27A' : '#3D6BE5' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

        {/* Meal Cards */}
        <div className="pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => onMealClick(meal)}
              className="w-full flex gap-4 p-4 rounded-2xl transition-all text-left"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              {/* Meal Image */}
              <div
                className="flex-shrink-0 rounded-xl overflow-hidden"
                style={{ width: '96px', height: '96px' }}
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meal Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#3D6BE5',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {meal.time} • {meal.type}
                  </p>
                </div>

                <h3 style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#1E2A5E',
                  marginBottom: '0.25rem'
                }}>
                  {meal.name}
                </h3>

                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#5E6680',
                  marginBottom: '0.5rem'
                }}>
                  {meal.localName}
                </p>

                {/* Safety Dots */}
                <div className="flex items-center gap-2 mb-2">
                  {meal.safety.map((status, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: status === 'safe' ? '#6E9A6E' : '#C9892E'
                      }}
                    />
                  ))}
                </div>

                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#5E6680'
                }}>
                  {meal.portion}
                </p>
              </div>
            </button>
          ))}
          </div>
        </div>

        {/* Regenerate Button */}
        <div className="flex justify-center md:justify-end pb-6">
          <button
            onClick={onRegenerate}
            disabled={!onRegenerate || isRegenerating}
            className="flex items-center gap-2 px-6 py-4 rounded-full transition-all shadow-lg"
            style={{
              backgroundColor: '#E8A92E',
              color: '#1E2A5E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              border: 'none',
              cursor: onRegenerate && !isRegenerating ? 'pointer' : 'not-allowed',
              opacity: isRegenerating ? 0.6 : 1,
              boxShadow: '0 8px 24px rgba(232, 169, 46, 0.3)'
            }}
          >
            <Sparkles size={18} />
            {isRegenerating ? 'Regenerating…' : 'Regenerate week'}
          </button>
        </div>
      </Container>
    </div>
  );
};