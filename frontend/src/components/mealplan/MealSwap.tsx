import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import Container from '../layout/Container';

interface MealSwapProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  currentMeal: {
    name: string;
    localName?: string;
    image: string;
  };
  onClose: () => void;
  onSwap: (newMeal: any) => void;
  alternatives?: any[];
}

export const MealSwap = ({ mealType, currentMeal, onClose, onSwap, alternatives: alternativesProp }: MealSwapProps) => {
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock alternative meals (fallback when no override is provided)
  const alternativesMock = {
    breakfast: [
      {
        id: 'b1',
        name: 'Akamu (Pap) + Moin Moin',
        localName: 'Ogi & Bean Pudding',
        image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80',
        calories: 310,
        carbs: '45g',
        protein: '12g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Low glycemic index, high protein'
      },
      {
        id: 'b2',
        name: 'Oats Porridge + Boiled Egg',
        localName: 'Oats with Egg',
        image: 'https://images.unsplash.com/photo-1517673400267-ad8d127a02f1?w=800&q=80',
        calories: 280,
        carbs: '38g',
        protein: '15g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'High fiber, slow-release energy'
      },
      {
        id: 'b3',
        name: 'Yam & Egg Sauce',
        localName: 'Ji & Egg Stew',
        image: 'https://images.unsplash.com/photo-1606914469633-86f4bc49e1c4?w=800&q=80',
        calories: 420,
        carbs: '68g',
        protein: '14g',
        safety: 'caution',
        safetyText: 'Half portion (diabetes)',
        reason: 'High carbs - watch portions'
      },
      {
        id: 'b4',
        name: 'Beans & Plantain Porridge',
        localName: 'Beans & Plantain',
        image: 'https://images.unsplash.com/photo-1596970582512-0f06d1969ef8?w=800&q=80',
        calories: 380,
        carbs: '58g',
        protein: '16g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'High fiber & protein'
      },
      {
        id: 'b5',
        name: 'Bread & Scrambled Egg',
        localName: 'Bread & Egg',
        image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800&q=80',
        calories: 340,
        carbs: '42g',
        protein: '18g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Quick, balanced option'
      }
    ],
    lunch: [
      {
        id: 'l1',
        name: 'Jollof Rice + Grilled Chicken',
        localName: 'Party Rice',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
        calories: 520,
        carbs: '62g',
        protein: '28g',
        safety: 'caution',
        safetyText: 'Small portions (diabetes)',
        reason: 'Moderate carbs - control portions'
      },
      {
        id: 'l2',
        name: 'Brown Rice & Garden Egg Stew',
        localName: 'Ofada Rice & Efo',
        image: 'https://images.unsplash.com/photo-1665332561290-cc6757172890?w=800&q=80',
        calories: 450,
        carbs: '54g',
        protein: '18g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Low glycemic, nutrient-rich'
      },
      {
        id: 'l3',
        name: 'Efo Riro + Small Eba',
        localName: 'Vegetable Soup',
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80',
        calories: 380,
        carbs: '48g',
        protein: '22g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Vegetable-rich, moderate carbs'
      },
      {
        id: 'l4',
        name: 'Grilled Fish + Salad',
        localName: 'Fish & Fresh Veggies',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
        calories: 320,
        carbs: '12g',
        protein: '38g',
        safety: 'safe',
        safetyText: 'Excellent for all conditions',
        reason: 'Low carb, high protein'
      }
    ],
    dinner: [
      {
        id: 'd1',
        name: 'Okra Soup + Small Eba',
        localName: 'Okro Soup',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
        calories: 350,
        carbs: '42g',
        protein: '18g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Low calorie, high fiber'
      },
      {
        id: 'd2',
        name: 'Vegetable Soup + Wheat Fufu',
        localName: 'Efo & Wheat Swallow',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
        calories: 380,
        carbs: '48g',
        protein: '20g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Whole grain option'
      },
      {
        id: 'd3',
        name: 'Pepper Soup + Unripe Plantain',
        localName: 'Native Soup',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
        calories: 340,
        carbs: '38g',
        protein: '24g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Light, protein-rich'
      }
    ],
    snack: [
      {
        id: 's1',
        name: 'Groundnuts + Garden Egg',
        localName: 'Epa & Igba',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80',
        calories: 180,
        carbs: '18g',
        protein: '8g',
        safety: 'safe',
        safetyText: 'Safe for all conditions',
        reason: 'Healthy fats & protein'
      },
      {
        id: 's2',
        name: 'Fresh Fruit Bowl',
        localName: 'Mixed Fruits',
        image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=800&q=80',
        calories: 120,
        carbs: '28g',
        protein: '2g',
        safety: 'caution',
        safetyText: 'Small portions (diabetes)',
        reason: 'Natural sugars - watch portions'
      },
      {
        id: 's3',
        name: 'Boiled Corn',
        localName: 'Agbado',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
        calories: 160,
        carbs: '32g',
        protein: '5g',
        safety: 'safe',
        safetyText: 'Safe for diabetes & BP',
        reason: 'Whole grain, filling'
      }
    ]
  };

  const mealOptions: any[] = alternativesProp ?? (alternativesMock as any)[mealType] ?? [];

  const filteredMeals = searchQuery
    ? mealOptions.filter(meal =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.localName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mealOptions;

  const handleConfirmSwap = () => {
    if (selectedMeal) {
      onSwap(selectedMeal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
        style={{ backgroundColor: '#FBFAF7', borderColor: '#E7E4DD' }}
      >
        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E'
        }}>
          Swap {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </h1>
        <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
          <X size={24} />
        </button>
      </div>

      <Container maxWidth="content">
        {/* Current Meal */}
        <div className="py-4 border-b" style={{ borderColor: '#E7E4DD' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8125rem',
          color: '#5E6680',
          marginBottom: '0.5rem'
        }}>
          Current meal
        </p>
        <div className="flex items-center gap-3">
          <img
            src={currentMeal.image}
            alt={currentMeal.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#1E2A5E'
            }}>
              {currentMeal.name}
            </p>
            {currentMeal.localName && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#5E6680'
              }}>
                {currentMeal.localName}
              </p>
            )}
          </div>
        </div>
      </div>

        {/* Search */}
        <div className="py-4">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alternatives..."
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

        {/* Alternatives List */}
        <div className="flex-1 overflow-y-auto pb-32">
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8125rem',
          color: '#5E6680',
          marginBottom: '1rem'
        }}>
          {filteredMeals.length} alternative{filteredMeals.length !== 1 ? 's' : ''} available
        </p>

        <div className="space-y-3">
          {filteredMeals.map((meal) => (
            <button
              key={meal.id}
              onClick={() => setSelectedMeal(meal)}
              className="w-full p-4 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: selectedMeal?.id === meal.id ? 'rgba(61, 107, 229, 0.08)' : '#FFFFFF',
                border: `2px solid ${selectedMeal?.id === meal.id ? '#3D6BE5' : '#E7E4DD'}`,
                boxShadow: selectedMeal?.id === meal.id ? '0 4px 12px rgba(61, 107, 229, 0.15)' : '0 2px 8px rgba(30, 42, 94, 0.04)',
                cursor: 'pointer'
              }}
            >
              <div className="flex gap-4">
                {/* Image */}
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
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

                  {/* Stats */}
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680'
                    }}>
                      {meal.calories} cal
                    </span>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680'
                    }}>
                      {meal.carbs} carbs
                    </span>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#5E6680'
                    }}>
                      {meal.protein} protein
                    </span>
                  </div>

                  {/* Safety */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meal.safety === 'safe' ? '#6E9A6E' : '#C9892E' }}
                    />
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: meal.safety === 'safe' ? '#6E9A6E' : '#C9892E',
                      fontWeight: 500
                    }}>
                      {meal.safetyText}
                    </p>
                  </div>

                  {/* Reason */}
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#5E6680',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    {meal.reason}
                  </p>
                </div>

                {/* Check Icon */}
                {selectedMeal?.id === meal.id && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#3D6BE5' }}
                  >
                    <Check size={14} style={{ color: '#FFFFFF' }} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        </div>
      </Container>

      {/* Bottom CTA */}
      {selectedMeal && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-6 border-t"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E7E4DD',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)'
          }}
        >
          <button
            onClick={handleConfirmSwap}
            className="w-full py-4 rounded-xl transition-all"
            style={{
              backgroundColor: '#3D6BE5',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(61, 107, 229, 0.2)'
            }}
          >
            Confirm swap
          </button>
        </div>
      )}
    </div>
  );
};
