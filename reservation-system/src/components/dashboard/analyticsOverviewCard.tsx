// ─────────────────────────────────────────────
// 🔹 Component: AnalyticsOverviewCard
// 🔹 Purpose: Display a small metric box with title, value, icon & trend
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

type AnalyticsOverviewCardProps = {
  title: string;
  value: string;
  percentageChange: number;
  icon: React.ReactNode;
};

export const AnalyticsOverviewCard: React.FC<AnalyticsOverviewCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm bg-white w-full">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800">{value}</div>
        <div className="flex items-center text-sm space-x-1">
          {isPositive ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500" />
          )}
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {percentageChange}%
          </span>
        </div>
      </div>
    </div>
  );
};
