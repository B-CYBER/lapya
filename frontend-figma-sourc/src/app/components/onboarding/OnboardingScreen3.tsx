import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import Container from '../layout/Container';

interface OnboardingScreen3Props {
  onNext: (data: { foods: string[]; allergies: string }) => void;
  onBack: () => void;
}

export const OnboardingScreen3 = ({ onNext, onBack }: OnboardingScreen3Props) => {
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set());
  const [allergies, setAllergies] = useState('');

  const foods = [
    { id: 'jollof', label: 'Jollof Rice', image: 'https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=800&q=80' },
    { id: 'eba', label: 'Eba & Soup', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80' },
    { id: 'pounded-yam', label: 'Pounded Yam', image: 'https://images.unsplash.com/photo-1610514000782-b205b70fbe71?w=800&q=80' },
    { id: 'beans', label: 'Beans', image: 'https://images.unsplash.com/photo-1665332561290-cc6757172890?w=800&q=80' },
    { id: 'rice-stew', label: 'Rice & Stew', image: 'https://images.unsplash.com/photo-1664992960082-0ea299a9c53e?w=800&q=80' },
    { id: 'plantain', label: 'Plantain', image: 'https://images.unsplash.com/photo-1540714605746-4f474eefc6d4?w=800&q=80' },
    { id: 'indomie', label: 'Indomie', image: 'https://images.unsplash.com/photo-1585029780574-65af8aa61abd?w=800&q=80' },
    { id: 'suya', label: 'Suya', image: 'https://images.unsplash.com/photo-1666190092689-e3968aa0c32c?w=800&q=80' },
    { id: 'bread-tea', label: 'Bread & Tea', image: 'https://images.unsplash.com/photo-1564810162011-0321d9dd26a5?w=800&q=80' },
    { id: 'pap-akara', label: 'Pap & Akara', image: 'https://images.unsplash.com/photo-1574810134700-b6ba48d151a0?w=800&q=80' },
    { id: 'tuwo', label: 'Tuwo', image: 'https://images.unsplash.com/photo-1618486013703-1d42e764b1ee?w=800&q=80' },
    { id: 'yam-porridge', label: 'Yam Porridge', image: 'https://images.unsplash.com/photo-1665333048952-a3ee97714c6b?w=800&q=80' }
  ];

  const toggleFood = (id: string) => {
    const newSelected = new Set(selectedFoods);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFoods(newSelected);
  };

  const handleNext = () => {
    onNext({ foods: Array.from(selectedFoods), allergies });
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      <Container maxWidth="auth">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-6">
          <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: step === 3 ? '#3D6BE5' : step < 3 ? '#A8BCF0' : '#E7E4DD'
              }}
            />
          ))}
        </div>
      </Container>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Container maxWidth="auth">
        <h1 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '2rem',
          fontWeight: 600,
          color: '#1E2A5E',
          marginBottom: '0.75rem'
        }}>
          What's on your table most days?
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          color: '#5E6680',
          marginBottom: '2rem'
        }}>
          We use this to make plans that feel like home.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {foods.map((food) => {
            const isSelected = selectedFoods.has(food.id);

            return (
              <button
                key={food.id}
                onClick={() => toggleFood(food.id)}
                className="relative aspect-square rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  border: `2px solid ${isSelected ? '#3D6BE5' : 'transparent'}`,
                  boxShadow: isSelected ? '0 4px 12px rgba(61, 107, 229, 0.2)' : 'none'
                }}
              >
                <img
                  src={food.image}
                  alt={food.label}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(to top, rgba(30, 42, 94, 0.85) 0%, rgba(30, 42, 94, 0.3) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(30, 42, 94, 0.6) 0%, transparent 60%)'
                  }}
                />
                <p
                  className="absolute bottom-1 left-0 right-0 text-center px-1"
                  style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    lineHeight: 1.2
                  }}
                >
                  {food.label}
                </p>

                {isSelected && (
                  <div
                    className="absolute top-1 right-1 rounded-full flex items-center justify-center"
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: '#E8A92E'
                    }}
                  >
                    <Check size={12} style={{ color: '#1E2A5E' }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <label
            htmlFor="allergies"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1E2A5E',
              display: 'block',
              marginBottom: '0.75rem'
            }}
          >
            Any food allergies?
          </label>
          <input
            id="allergies"
            type="text"
            placeholder="e.g., peanuts, shellfish"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full px-4 py-3 rounded-xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E7E4DD',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: '#1A2244',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3D6BE5';
              e.target.style.boxShadow = '0 0 0 3px rgba(61, 107, 229, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E7E4DD';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        </Container>
      </div>

      {/* Next Button */}
      <Container maxWidth="auth">
        <div className="py-8">
          <button
          onClick={handleNext}
          disabled={selectedFoods.size === 0}
          className="w-full py-4 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: selectedFoods.size > 0 ? '#3D6BE5' : '#E7E4DD',
            color: selectedFoods.size > 0 ? '#FFFFFF' : '#5E6680',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            border: 'none',
            cursor: selectedFoods.size > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedFoods.size > 0 ? '0 4px 16px rgba(30, 42, 94, 0.12)' : 'none'
          }}
        >
          Next
          </button>
        </div>
      </Container>
    </div>
  );
};
