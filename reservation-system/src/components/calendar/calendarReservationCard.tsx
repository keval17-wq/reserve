import React from 'react';

type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

export const CalendarReservationCard = ({
  reservation,
  onClick,
}: {
  reservation: Reservation;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-blue-100 hover:bg-blue-200 cursor-pointer px-2 py-1 rounded text-xs text-blue-900"
    >
      {reservation.customer_name} @ {new Date(reservation.reservation_time).toLocaleTimeString()}
    </div>
  );
};
