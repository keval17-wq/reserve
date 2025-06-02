'use client';
import React from 'react';
import { Reservation } from '@/lib/supabase/calendar';

interface Props {
  weekData: {
    date: string;
    label: string;
    reservations: Reservation[];
  }[];
  selectedDate: string;
  onSelectDay: (day: { date: string; label: string }) => void;
}

export const WeekView = ({ weekData, selectedDate, onSelectDay }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
      {weekData.map((day) => (
        <div
          key={day.date}
          className={`border p-3 rounded-lg cursor-pointer ${
            selectedDate === day.date ? 'bg-blue-100' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectDay(day)}
        >
          <div className="font-semibold">{day.label}</div>
          <div className="text-sm text-gray-500">{day.reservations.length} reservations</div>
        </div>
      ))}
    </div>
  );
};
