'use client';
import React from 'react';
import { ReservationRow } from '@/lib/supabase/calendar';

interface Props {
  dayLabel: string;
  reservations: ReservationRow[];
  onSelect: (res: ReservationRow) => void;
}

export const ReservationList = ({ dayLabel, reservations, onSelect }: Props) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{dayLabel} Reservations</h2>
      {reservations.length === 0 && (
        <p className="text-sm text-gray-500">No reservations for this day.</p>
      )}
      {reservations.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <div className="font-medium">{r.customer_name} — {new Date(r.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-sm text-gray-500">Table {r.table_number}</div>
        </div>
      ))}
    </div>
  );
};
