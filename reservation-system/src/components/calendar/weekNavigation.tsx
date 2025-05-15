// ✅ components/calendar/weekNavigation.tsx
'use client';

import React from 'react';

type Props = {
  currentStart: Date;
  onPrev: () => void;
  onNext: () => void;
};

export const WeekNavigation = ({ currentStart, onPrev, onNext }: Props) => {
  const end = new Date(currentStart);
  end.setDate(currentStart.getDate() + 6);

  const label = `${currentStart.toLocaleDateString()} – ${end.toLocaleDateString()}`;

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={onPrev} className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
        ← Previous
      </button>
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <button onClick={onNext} className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded">
        Next →
      </button>
    </div>
  );
};
