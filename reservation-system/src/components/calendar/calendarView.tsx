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

export const CalendarView: React.FC<Props> = ({ days = [], onSelectReservation }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {days.map((day, idx) => (
        <div
          key={idx}
          className="border rounded-2xl shadow-sm bg-white p-4 hover:shadow-md transition-all duration-300"
        >
          <div className="text-md font-bold text-gray-800 border-b pb-2 mb-3">
            {new Date(day.date).toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>

          <div className="space-y-3">
            {(day.reservations ?? []).length > 0 ? (
              day.reservations.map((res) => (
                <CalendarReservationCard
                  key={res.id}
                  reservation={res}
                  onClick={() => onSelectReservation(res)}
                />
              ))
            ) : (
              <div className="text-sm text-gray-400 italic">No reservations</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
