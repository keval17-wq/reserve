// ─────────────────────────────────────────────
// 🔹 Component: DashboardStatsCard
// 🔹 Purpose: Display single dashboard metric (Reservation, Revenue, etc.)
// 🔹 Created: April 29, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

type DashboardStatsCardProps = {
  title: string;
  value: string;
  percentageChange: number;
  icon: React.ReactNode;
};

export const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        <div className="text-blue-500">{icon}</div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="flex items-center space-x-1 text-sm">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {percentageChange}%
          </span>
        </div>
      </div>
    </div>
  );
};
