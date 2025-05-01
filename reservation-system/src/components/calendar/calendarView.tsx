'use client';

import React from 'react';
import { CalendarReservationCard } from './calendarReservationCard';

type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

type Props = {
  days: { date: string; reservations: Reservation[] }[];
  onSelectReservation: (reservation: Reservation) => void;
};

export const CalendarView: React.FC<Props> = ({ days, onSelectReservation }) => {
  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day, idx) => (
        <div key={idx} className="border rounded-lg p-2 min-h-[100px]">
          <div className="text-sm font-semibold text-gray-600">{new Date(day.date).toDateString()}</div>
          <div className="mt-2 space-y-1">
            {day.reservations.map((res) => (
              <CalendarReservationCard
                key={res.id}
                reservation={res}
                onClick={() => onSelectReservation(res)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
