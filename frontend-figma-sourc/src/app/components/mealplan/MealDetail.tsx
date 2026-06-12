import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import Container from '../layout/Container';

interface MealDetailProps {
  meal: any;
  onBack: () => void;
  onSwap?: (meal: any) => void;
  onViewRecipe?: (meal: any) => void;
}

export const MealDetail = ({ meal, onBack, onSwap, onViewRecipe }: MealDetailProps) => {
  const [activeTab, setActiveTab] = useState('why');

  const tabs = [
    { id: 'why', label: 'Why this meal' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'cook', label: 'How to cook' }
  ];

  const ingredients = [
    '500g beans (black-eyed peas)',
    '1 medium onion',
    '2 fresh peppers',
    '1 tsp salt',
    'Palm oil for frying'
  ];

  const cookingSteps = [
    'Soak beans overnight, peel off skins',
    'Blend with onions and peppers',
    'Add salt and beat mixture until fluffy',
    'Heat palm oil in deep pan',
    'Scoop and fry until golden brown'
  ];

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Hero Image with Overlay */}
      <div className="relative h-80">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(30, 42, 94, 0.4) 0%, transparent 50%)'
          }}
        />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#1E2A5E'
          }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Content Sheet */}
      <div
        className="flex-1 rounded-t-3xl -mt-7 relative"
        style={{ backgroundColor: '#FBFAF7' }}
      >
        <Container maxWidth="content">
          <div className="pt-6">
          {/* Dish Name */}
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#1E2A5E',
            marginBottom: '0.5rem',
            lineHeight: 1.2
          }}>
            {meal.name}
          </h1>

          <p style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#5E6680',
            marginBottom: '1.5rem'
          }}>
            {meal.localName}
          </p>

          {/* Stats Pills */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <div
              className="flex-shrink-0 px-4 py-2 rounded-full"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#1E2A5E'
              }}>
                <span style={{ fontWeight: 600 }}>320</span> kcal
              </p>
            </div>
            <div
              className="flex-shrink-0 px-4 py-2 rounded-full"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#1E2A5E'
              }}>
                <span style={{ fontWeight: 600 }}>45g</span> carbs
              </p>
            </div>
            <div
              className="flex-shrink-0 px-4 py-2 rounded-full"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#1E2A5E'
              }}>
                <span style={{ fontWeight: 600 }}>12g</span> protein
              </p>
            </div>
          </div>

          {/* Tab Strip */}
          <div
            className="flex gap-6 mb-6 border-b"
            style={{ borderColor: '#E7E4DD' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-3 relative transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? '#3D6BE5' : '#5E6680',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#3D6BE5' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-32">
            {activeTab === 'why' && (
              <div className="space-y-3">
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  This meal is balanced for both your conditions:
                </p>

                <div className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2"
                    style={{ backgroundColor: '#6E9A6E' }}
                  />
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    color: '#5E6680',
                    lineHeight: 1.6
                  }}>
                    Low sodium — no maggi cube used
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2"
                    style={{ backgroundColor: '#6E9A6E' }}
                  />
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    color: '#5E6680',
                    lineHeight: 1.6
                  }}>
                    Rich in protein and fiber for sustained energy
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check size={18} style={{ color: '#3D6BE5', marginTop: '2px' }} />
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#1E2A5E',
                      lineHeight: 1.6
                    }}>
                      {ingredient}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cook' && (
              <div className="space-y-4">
                {cookingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#A8BCF0' }}
                    >
                      <span style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#1E2A5E'
                      }}>
                        {index + 1}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#1E2A5E',
                      lineHeight: 1.6,
                      paddingTop: '0.25rem'
                    }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </Container>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-6 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E7E4DD'
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => onViewRecipe?.({
              ...meal,
              prepTime: '15 min',
              cookTime: '30 min',
              servings: 4,
              calories: meal.calories || 280
            })}
            className="flex-1 py-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid #E8A92E',
              color: '#E8A92E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            View recipe
          </button>
          <button
            onClick={() => onSwap?.(meal)}
            className="flex-1 py-4 rounded-xl transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1.5px solid #3D6BE5',
              color: '#3D6BE5',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Swap meal
          </button>
          <button
            className="flex-1 py-4 rounded-xl transition-all"
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
            I ate this
          </button>
        </div>
      </div>
    </div>
  );
};