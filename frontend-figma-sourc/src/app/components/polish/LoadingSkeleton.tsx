import React from 'react';

interface LoadingSkeletonProps {
  type: 'mealCard' | 'list' | 'profile' | 'stats';
}

export const LoadingSkeleton = ({ type }: LoadingSkeletonProps) => {
  if (type === 'mealCard') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD',
              boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
            }}
          >
            <div
              className="h-44 animate-pulse"
              style={{ backgroundColor: '#E7E4DD' }}
            />
            <div className="p-4 space-y-3">
              <div
                className="h-5 w-3/4 rounded animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
              <div
                className="h-4 w-1/2 rounded animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
              <div
                className="h-10 w-20 rounded-lg animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD'
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-3/4 rounded animate-pulse"
                  style={{ backgroundColor: '#E7E4DD' }}
                />
                <div
                  className="h-3 w-1/2 rounded animate-pulse"
                  style={{ backgroundColor: '#E7E4DD' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="space-y-6">
        <div
          className="p-6 rounded-3xl"
          style={{ backgroundColor: '#1E2A5E' }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="w-20 h-20 rounded-full animate-pulse"
              style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
            />
            <div className="flex-1 space-y-3">
              <div
                className="h-6 w-2/3 rounded animate-pulse"
                style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
              />
              <div
                className="h-4 w-1/2 rounded animate-pulse"
                style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div
                  className="h-8 w-12 mx-auto rounded animate-pulse"
                  style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
                />
                <div
                  className="h-3 w-16 mx-auto rounded animate-pulse"
                  style={{ backgroundColor: 'rgba(168, 188, 240, 0.2)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD'
            }}
          >
            <div className="space-y-2">
              <div
                className="h-8 w-12 rounded animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
              <div
                className="h-3 w-16 rounded animate-pulse"
                style={{ backgroundColor: '#E7E4DD' }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
