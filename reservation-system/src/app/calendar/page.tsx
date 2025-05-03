'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default calendar styles

import { CalendarView } from '@/components/calendar/calendarView';
import { ReservationModal } from '@/components/calendar/reservationModal';
import { getReservationsByMonth } from '@/lib/supabase/calendar';

// Type for each reservation
type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

type ReservationsByDate = {
  date: string; // formatted as 'YYYY-MM-DD'
  reservations: Reservation[];
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [monthlyReservations, setMonthlyReservations] = useState<ReservationsByDate[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchMonthlyReservations = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;

        const reservations = await getReservationsByMonth(year, month);
        setMonthlyReservations(reservations as ReservationsByDate[]);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchMonthlyReservations();
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Calendar</h1>
      <p className="text-sm text-gray-600 mb-4">
        View reservations by date and manage them dynamically.
      </p>

      {/* Calendar with forced light styling */}
      <div className="[&_.react-calendar]:bg-white [&_.react-calendar]:text-black [&_.react-calendar__tile--active]:bg-blue-600 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile--now]:bg-yellow-300 [&_.react-calendar__tile--now]:text-black">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          calendarType="gregory"
          locale="en-US"
        />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Reservations Overview</h2>
        <CalendarView
          days={monthlyReservations}
          onSelectReservation={(reservation) => setSelectedReservation(reservation)}
        />
      </div>

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onCancel={() => {
            // Add cancel logic here
            setSelectedReservation(null);
          }}
          onMove={() => {
            // Add move logic here
            setSelectedReservation(null);
          }}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}
