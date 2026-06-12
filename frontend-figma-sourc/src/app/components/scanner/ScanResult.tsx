import React from 'react';

interface ScanResultProps {
  onLogMeal: () => void;
  onScanAgain: () => void;
}

export const ScanResult = ({ onLogMeal, onScanAgain }: ScanResultProps) => {
  const nutritionStats = [
    { label: 'Calories', value: '580 kcal' },
    { label: 'Carbs', value: '78g' },
    { label: 'Sodium', value: '420mg' },
    { label: 'Potassium', value: '380mg' }
  ];

  const safetyCards = [
    {
      condition: 'Type 2 Diabetes',
      status: 'safe',
      message: 'Eat half portion for safe glucose.',
      dot: '#6E9A6E'
    },
    {
      condition: 'High Blood Pressure',
      status: 'caution',
      message: 'Sodium higher than ideal — pair with water and skip salt-rich snacks today.',
      dot: '#C9892E'
    }
  ];

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&q=80"
          alt="Scanned meal"
          className="w-full h-80 object-cover"
        />

        {/* Confidence Badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: 'rgba(232, 169, 46, 0.95)',
            border: '2px solid #F4D27A'
          }}
        >
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#1E2A5E'
          }}>
            94% sure
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        {/* Identification Label */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: '#3D6BE5',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '0.5rem'
        }}>
          We see…
        </p>

        {/* Dish Name */}
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          Jollof Rice + Fried Plantain
        </h1>

        {/* Alternative Guesses */}
        <div className="flex gap-2 mb-6">
          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: '#A8BCF0',
              border: '1px solid #3D6BE5'
            }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#1E2A5E'
            }}>
              Concoction rice?
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: '#A8BCF0',
              border: '1px solid #3D6BE5'
            }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#1E2A5E'
            }}>
              Coconut rice?
            </p>
          </div>
        </div>

        {/* Nutrition Grid */}
        <h3 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '1rem'
        }}>
          Nutrition
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {nutritionStats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#1E2A5E',
                marginBottom: '0.25rem'
              }}>
                {stat.label}
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1E2A5E'
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Safety Assessment */}
        <h3 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '1rem'
        }}>
          Safety for your conditions
        </h3>

        <div className="space-y-3 mb-6">
          {safetyCards.map((card, index) => (
            <div
              key={index}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: '#FFFFFF',
                borderLeft: `4px solid ${card.dot}`,
                boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2"
                  style={{ backgroundColor: card.dot }}
                />
                <div className="flex-1">
                  <p style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#1E2A5E',
                    marginBottom: '0.25rem'
                  }}>
                    {card.condition}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#5E6680',
                    lineHeight: 1.5
                  }}>
                    {card.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Source Attribution */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.6875rem',
          color: '#5E6680',
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          Nutrition data from West African Food Composition Table
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-6 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E7E4DD'
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={onScanAgain}
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
            Scan again
          </button>
          <button
            onClick={onLogMeal}
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
            Log this meal
          </button>
        </div>
      </div>
    </div>
  );
};
