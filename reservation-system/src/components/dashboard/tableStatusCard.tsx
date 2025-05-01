// ─────────────────────────────────────────────
// 🔹 Component: TableStatusCard
// 🔹 Purpose: Display single table status (Available, Reserved, etc.)
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import React from 'react';

type TableStatusCardProps = {
  label: string;
  count: number;
  percentage: string;
  color: string; // tailwind color classes e.g. bg-green-100
  icon: React.ReactNode;
};

export const TableStatusCard: React.FC<TableStatusCardProps> = ({
  label,
  count,
  percentage,
  color,
  icon,
}) => {
  return (
    <div className={`rounded-lg p-4 ${color} flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div>{icon}</div>
      </div>
      <div className="mt-3 text-xl font-bold">{count}</div>
      <div className="text-sm text-gray-700">{percentage} of total</div>
    </div>
  );
};
