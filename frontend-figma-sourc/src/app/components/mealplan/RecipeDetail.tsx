import React, { useState } from 'react';
import { ChevronLeft, Clock, Users, Flame, ChefHat, Check } from 'lucide-react';
import Container from '../layout/Container';

interface RecipeDetailProps {
  recipe: {
    name: string;
    localName?: string;
    image: string;
    prepTime: string;
    cookTime: string;
    servings: number;
    calories: number;
  };
  onBack: () => void;
}

export const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const ingredients = [
    { item: 'Brown rice', amount: '2 cups (1 derica)' },
    { item: 'Garden egg (eggplant)', amount: '4 medium, diced' },
    { item: 'Tomatoes', amount: '5 medium, blended' },
    { item: 'Red bell pepper', amount: '2 medium' },
    { item: 'Onion', amount: '1 large, chopped' },
    { item: 'Palm oil', amount: '3 tablespoons' },
    { item: 'Crayfish (ground)', amount: '2 tablespoons' },
    { item: 'Stock cubes', amount: '2 cubes' },
    { item: 'Salt', amount: 'To taste' },
    { item: 'Water', amount: '4 cups' }
  ];

  const steps = [
    { number: 1, instruction: 'Rinse brown rice thoroughly and set aside. Boil water in a pot.' },
    { number: 2, instruction: 'Add rice to boiling water with a pinch of salt. Cook for 25-30 minutes until tender. Drain and set aside.' },
    { number: 3, instruction: 'In a separate pot, heat palm oil over medium heat. Add chopped onions and sauté until translucent.' },
    { number: 4, instruction: 'Add blended tomatoes and peppers. Cook for 10-15 minutes, stirring occasionally until oil separates from the sauce.' },
    { number: 5, instruction: 'Add diced garden eggs to the sauce. Stir gently to combine.' },
    { number: 6, instruction: 'Season with crayfish, stock cubes, and salt. Add 1 cup of water if sauce is too thick.' },
    { number: 7, instruction: 'Cover and simmer for 15-20 minutes until garden eggs are soft but not mushy.' },
    { number: 8, instruction: 'Serve hot stew over brown rice. Garnish with sliced onions if desired.' }
  ];

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Header Image */}
      <div className="relative" style={{ height: '240px' }}>
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(30, 42, 94, 0.3) 0%, rgba(30, 42, 94, 0.7) 100%)'
          }}
        />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-5 left-6 p-2 rounded-xl"
          style={{
            backgroundColor: 'rgba(251, 250, 247, 0.9)',
            color: '#1E2A5E',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Title */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '0.25rem',
            lineHeight: 1.2
          }}>
            {recipe.name}
          </h1>
          {recipe.localName && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#F4D27A'
            }}>
              {recipe.localName}
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div
        className="px-6 py-4 border-b"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E7E4DD' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} style={{ color: '#5E6680' }} />
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                color: '#5E6680',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                PREP
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                {recipe.prepTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ChefHat size={18} style={{ color: '#5E6680' }} />
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                color: '#5E6680',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                COOK
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                {recipe.cookTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users size={18} style={{ color: '#5E6680' }} />
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                color: '#5E6680',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                SERVES
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                {recipe.servings}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Flame size={18} style={{ color: '#E8A92E' }} />
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                color: '#5E6680',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                CALORIES
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                {recipe.calories}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b" style={{ borderColor: '#E7E4DD' }}>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('ingredients')}
            className="flex-1 py-2.5 rounded-lg"
            style={{
              backgroundColor: activeTab === 'ingredients' ? '#3D6BE5' : 'transparent',
              color: activeTab === 'ingredients' ? '#FFFFFF' : '#5E6680',
              border: `1.5px solid ${activeTab === 'ingredients' ? '#3D6BE5' : '#E7E4DD'}`,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className="flex-1 py-2.5 rounded-lg"
            style={{
              backgroundColor: activeTab === 'steps' ? '#3D6BE5' : 'transparent',
              color: activeTab === 'steps' ? '#FFFFFF' : '#5E6680',
              border: `1.5px solid ${activeTab === 'steps' ? '#3D6BE5' : '#E7E4DD'}`,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Steps ({completedSteps.length}/{steps.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-5">
        <Container maxWidth="content">
        {activeTab === 'ingredients' ? (
          <div className="space-y-3">
            {ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E4DD'
                }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#1E2A5E'
                }}>
                  {ingredient.item}
                </span>
                <span style={{
                  fontFamily: 'Sora, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#5E6680'
                }}>
                  {ingredient.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.number);
              return (
                <div
                  key={step.number}
                  onClick={() => toggleStep(step.number)}
                  className="p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: isCompleted ? 'rgba(110, 154, 110, 0.08)' : '#FFFFFF',
                    border: `1.5px solid ${isCompleted ? 'rgba(110, 154, 110, 0.3)' : '#E7E4DD'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isCompleted ? '#6E9A6E' : 'rgba(61, 107, 229, 0.12)',
                        color: isCompleted ? '#FFFFFF' : '#3D6BE5',
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 700
                      }}
                    >
                      {isCompleted ? <Check size={16} /> : step.number}
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      color: isCompleted ? '#5E6680' : '#1E2A5E',
                      lineHeight: 1.6,
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      flex: 1
                    }}>
                      {step.instruction}
                    </p>
                  </div>
                </div>
              );
            })}

            {completedSteps.length === steps.length && (
              <div
                className="p-4 rounded-xl mt-4"
                style={{
                  backgroundColor: 'rgba(110, 154, 110, 0.12)',
                  border: '1.5px solid rgba(110, 154, 110, 0.3)'
                }}
              >
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#1E2A5E',
                  textAlign: 'center',
                  lineHeight: 1.6
                }}>
                  🎉 Great job! You have completed all steps. Enjoy your meal!
                </p>
              </div>
            )}
          </div>
        )}
        </Container>
      </div>
    </div>
  );
};
