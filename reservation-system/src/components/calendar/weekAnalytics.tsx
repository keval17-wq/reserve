'use client';
import { Reservation } from '@/lib/supabase/calendar';
import React from 'react';

interface Props {
  weekData: {
    date: string;
    label: string;
    reservations: Reservation[];
  }[];
}

export const WeekAnalytics = ({ weekData }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 text-center text-sm text-gray-700">
      {weekData.map((day) => (
        <div key={day.date}>
          <div className="font-bold">{day.label.split(',')[0]}</div>
          <div>{day.reservations.length} reservations</div>
        </div>
      ))}
    </div>
  );
};
