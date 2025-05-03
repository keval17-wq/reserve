
// ✅ components/calendar/ReservationCard.tsx
import React from 'react';

export const ReservationCard = ({ reservation, onClick }: {
  reservation: any;
  onClick: () => void;
}) => {
  return (
    <div
      className="border p-4 rounded shadow hover:bg-blue-50 cursor-pointer"
      onClick={onClick}
    >
      <p className="text-sm font-medium text-gray-800">Customer: {reservation.customer_name}</p>
      <p className="text-sm text-gray-600">Table: {reservation.table_number}</p>
      <p className="text-sm text-gray-600">Time: {new Date(reservation.reservation_time).toLocaleTimeString()}</p>
    </div>
  );
};