// ✅ components/analytics/overviewCard.tsx
'use client';

import React from 'react';

export const OverviewCard = ({
  title,
  value,
  delta,
}: {
  title: string;
  value: string | number;
  delta: number;
}) => {
  const isPositive = delta >= 0;
  return (
    <div className="p-4 rounded shadow bg-white border space-y-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-gray-800">{value}</p>
      <span
        className={`text-xs font-semibold ${
          isPositive ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {isPositive ? '+' : ''}{delta}% from last week
      </span>
    </div>
  );
};