// src/components/tables/TableCard.tsx
import React from 'react';
import { Clock, Users } from 'lucide-react';

export type TableCardProps = {
  table_number: number;
  capacity: number;
  status: string; // available / reserved / occupied / maintenance
  nextReservationTime?: string; // 'HH:MM' or undefined if none
  onClick: () => void;
};

export const TableCard: React.FC<TableCardProps> = ({
  table_number,
  capacity,
  status,
  nextReservationTime,
  onClick,
}) => {
  // Status badge color
  let badgeColor = 'bg-green-100 text-green-800';
  if (status === 'reserved') badgeColor = 'bg-yellow-100 text-yellow-800';
  else if (status === 'occupied') badgeColor = 'bg-blue-100 text-blue-800';
  else if (status === 'maintenance') badgeColor = 'bg-red-100 text-red-800';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Table {table_number}</h2>
        <span className={`px-2 py-1 text-xs font-medium rounded ${badgeColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-600 space-x-4">
        <Users className="h-4 w-4" />
        <span>{capacity} seats</span>
      </div>
      {nextReservationTime && (
        <div className="mt-2 flex items-center text-sm text-gray-600 space-x-1">
          <Clock className="h-4 w-4" />
          <span>Next: {nextReservationTime}</span>
        </div>
      )}
    </div>
  );
};
