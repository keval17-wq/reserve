'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { CalendarView } from '@/components/calendar/calendarView';
import { ReservationModal } from '@/components/calendar/reservationModal';
import { getReservationsByMonth } from '@/lib/supabase/calendar';

// 🟢 Type for each reservation
type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [monthlyReservations, setMonthlyReservations] = useState<
    { date: string; reservations: Reservation[] }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      try {
        const reservations = await getReservationsByMonth(year, month);
        setMonthlyReservations(reservations as { date: string; reservations: Reservation[] }[]);
      } catch (err) {
        console.error('Failed to load reservations:', err);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Calendar</h1>
      <p className="text-sm text-gray-600 mb-4">View reservations by date and manage them dynamically.</p>

      <Calendar
        onChange={(val) => setSelectedDate(val as Date)} // ✅ Type-cast correctly
        value={selectedDate}
        calendarType="gregory" // ✅ Correct calendar type
        locale="en-US"
      />

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Reservations Overview</h2>

        <CalendarView
          days={monthlyReservations}
          onSelectReservation={(res) => setSelectedReservation(res)}
        />
      </div>

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onCancel={() => {
            console.log('Cancel reservation', selectedReservation.id);
            setSelectedReservation(null);
          }}
          onMove={() => {
            console.log('Move reservation', selectedReservation.id);
            setSelectedReservation(null);
          }}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}
