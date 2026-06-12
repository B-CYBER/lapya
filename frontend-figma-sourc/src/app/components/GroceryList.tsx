import React, { useState } from 'react';
import { ChevronLeft, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import Container from './layout/Container';

interface GroceryListProps {
  onBack: () => void;
}

export const GroceryList = ({ onBack }: GroceryListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['proteins', 'grains', 'vegetables', 'fruits', 'essentials'])
  );

  const categories = [
    {
      id: 'proteins',
      name: 'PROTEINS',
      count: 5,
      items: [
        { id: 'mackerel', name: 'Mackerel', quantity: '2 medium', price: '₦2,500' },
        { id: 'beans', name: 'Beans (black-eyed)', quantity: '1 mudu', price: '₦1,800' },
        { id: 'eggs', name: 'Eggs', quantity: '12 pieces', price: '₦2,100' },
        { id: 'chicken', name: 'Chicken breast', quantity: '500g', price: '₦3,200' },
        { id: 'crayfish', name: 'Ground crayfish', quantity: '1 cup', price: '₦1,200' }
      ]
    },
    {
      id: 'grains',
      name: 'GRAINS & STARCHES',
      count: 4,
      items: [
        { id: 'brown-rice', name: 'Brown rice', quantity: '2 derica', price: '₦1,600' },
        { id: 'garri', name: 'Garri (white)', quantity: '1 mudu', price: '₦800' },
        { id: 'yam', name: 'Yam tuber', quantity: '1 medium', price: '₦1,500' },
        { id: 'oats', name: 'Oats', quantity: '500g', price: '₦900' }
      ]
    },
    {
      id: 'vegetables',
      name: 'VEGETABLES',
      count: 8,
      items: [
        { id: 'spinach', name: 'Spinach (Efo tete)', quantity: '2 bunches', price: '₦400' },
        { id: 'tomatoes', name: 'Fresh tomatoes', quantity: '10 pieces', price: '₦1,000' },
        { id: 'peppers', name: 'Bell peppers', quantity: '5 pieces', price: '₦500' },
        { id: 'onions', name: 'Onions', quantity: '5 medium', price: '₦600' },
        { id: 'okra', name: 'Okra', quantity: '1 bundle', price: '₦300' },
        { id: 'garden-egg', name: 'Garden egg', quantity: '8 pieces', price: '₦400' },
        { id: 'ugwu', name: 'Ugwu (fluted pumpkin)', quantity: '1 bundle', price: '₦300' },
        { id: 'carrots', name: 'Carrots', quantity: '4 pieces', price: '₦400' }
      ]
    },
    {
      id: 'fruits',
      name: 'FRUITS',
      count: 3,
      items: [
        { id: 'plantain', name: 'Unripe plantain', quantity: '4 fingers', price: '₦600' },
        { id: 'orange', name: 'Oranges', quantity: '6 pieces', price: '₦500' },
        { id: 'blueberries', name: 'Blueberries', quantity: '1 small punnet', price: '₦1,500' }
      ]
    },
    {
      id: 'essentials',
      name: 'COOKING ESSENTIALS',
      count: 3,
      items: [
        { id: 'palm-oil', name: 'Palm oil', quantity: '1 bottle', price: '₦1,200' },
        { id: 'groundnut-oil', name: 'Groundnut oil', quantity: '1 bottle', price: '₦2,000' },
        { id: 'locust-beans', name: 'Locust beans (Iru)', quantity: '100g', price: '₦300' }
      ]
    }
  ];

  const totalItems = categories.reduce((sum, cat) => sum + cat.count, 0);
  const checkedCount = checkedItems.size;

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ backgroundColor: '#FBFAF7' }}
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
          Grocery List — This Week
        </h1>
        <button className="p-2" style={{ color: '#1E2A5E' }}>
          <Share2 size={22} />
        </button>
      </div>

      <Container maxWidth="content">
        {/* Summary Hero Card */}
        <div className="mb-6">
        <div
          className="p-6 rounded-3xl"
          style={{ backgroundColor: '#1E2A5E' }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#F4D27A',
                marginBottom: '0.5rem'
              }}>
                🛒 {totalItems} items
              </h2>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                color: '#A8BCF0'
              }}>
                Estimated ₦18,500
              </p>
            </div>
            <button style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#E8A92E',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}>
              Recalculate
            </button>
          </div>
        </div>
        </div>

        {/* Grocery List */}
        <div className="flex-1 overflow-y-auto pb-32">
        <div className="space-y-4">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);

            return (
              <div key={category.id}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between py-3 border-b"
                  style={{
                    borderColor: '#E7E4DD',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #E7E4DD',
                    cursor: 'pointer'
                  }}
                >
                  <h3 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#1E2A5E',
                    letterSpacing: '0.5px'
                  }}>
                    {category.name} ({category.count})
                  </h3>
                  {isExpanded ? (
                    <ChevronUp size={20} style={{ color: '#3D6BE5' }} />
                  ) : (
                    <ChevronDown size={20} style={{ color: '#3D6BE5' }} />
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="space-y-2 mt-3">
                    {category.items.map((item) => {
                      const isChecked = checkedItems.has(item.id);

                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center gap-4 py-3 text-left"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: isChecked ? '#3D6BE5' : 'transparent',
                              border: `2px solid ${isChecked ? '#3D6BE5' : '#E7E4DD'}`
                            }}
                          >
                            {isChecked && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path
                                  d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                                  stroke="#FFFFFF"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Item Info */}
                          <div className="flex-1">
                            <p style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '1rem',
                              color: isChecked ? '#5E6680' : '#1E2A5E',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              marginBottom: '0.125rem'
                            }}>
                              {item.name}
                            </p>
                            <p style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.875rem',
                              color: '#5E6680'
                            }}>
                              {item.quantity}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </Container>

      {/* Bottom Share Button */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-6 border-t"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#E7E4DD'
        }}
      >
        <button
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
          Share with my shopper
        </button>
      </div>
    </div>
  );
};
