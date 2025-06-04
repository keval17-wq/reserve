// ✅ components/calendar/ReservationCard.tsx
import React from 'react';
import type { ReservationRow } from '@/lib/supabase/calendar';

interface Props {
  reservation: ReservationRow;
  onClick: () => void;
}

export const ReservationCard = ({ reservation, onClick }: Props) => {
  return (
    <div
      className="border p-4 rounded shadow hover:bg-blue-50 cursor-pointer"
      onClick={onClick}
    >
      <p className="text-sm font-medium text-gray-800">Customer: {reservation.customer_name}</p>
      <p className="text-sm text-gray-600">Table: {reservation.table_number}</p>
      <p className="text-sm text-gray-600">
        Time: {new Date(reservation.reservation_time).toLocaleTimeString()}
      </p>
    </div>
  );
};
