'use client';

import React from 'react';

type DayReservation = {
  date: string;
  reservations: {
    id: string;
    customer_name: string;
    table_number: number;
    reservation_time: string;
  }[];
};

type Props = {
  weekData: DayReservation[];
  onSelectReservation: (reservation: DayReservation['reservations'][0]) => void;
};

export const WeekView = ({ weekData, onSelectReservation }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekData.map((day) => (
        <div key={day.date} className="bg-white border p-3 rounded shadow-sm">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">{day.date}</h3>
          {day.reservations.length > 0 ? (
            day.reservations.map((res) => (
              <div
                key={res.id}
                onClick={() => onSelectReservation(res)}
                className="bg-blue-50 hover:bg-blue-100 text-sm p-2 rounded cursor-pointer mb-1"
              >
                <p>{res.customer_name}</p>
                <p className="text-xs text-gray-500">
                  Table {res.table_number} @ {new Date(res.reservation_time).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No reservations</p>
          )}
        </div>
      ))}
    </div>
  );
};
