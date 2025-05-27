'use client';

import React, { useEffect, useState } from 'react';
import { getReservationsByMonth, Reservation } from '@/lib/supabase/calendar';
import { CalendarHeader } from '@/components/calendar/calendarHeader';
import { WeekView } from '@/components/calendar/weekView';
import { WeekAnalytics } from '@/components/calendar/weekAnalytics';
import { ReservationList } from '@/components/calendar/reservationList';
import { ReservationModal } from '@/components/calendar/reservationModal';

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Sunday as start
    return start;
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>(() =>
    new Date().toISOString().split('T')[0]
  );
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth() + 1;
      const result = await getReservationsByMonth(year, month);
      setReservations(result);
    };
    fetchReservations();
  }, [currentWeekStart]);

  const getWeekData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      const iso = day.toISOString().split('T')[0];
      return {
        date: iso,
        label: day.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        reservations: reservations.filter(r => {
          const localDate = new Date(r.reservation_time).toLocaleDateString('en-CA'); // YYYY-MM-DD
          return localDate === iso;
        }),


      };
    });
  };

  const weekData = getWeekData();
  const selectedDayData = weekData.find(day => day.date === selectedDay);

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-black">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold mb-4 lg:mb-0">Calendar</h1>
        <CalendarHeader
          currentWeekStart={currentWeekStart}
          onPrev={() =>
            setCurrentWeekStart(prev => new Date(prev.getTime() - 7 * 86400000))
          }
          onNext={() =>
            setCurrentWeekStart(prev => new Date(prev.getTime() + 7 * 86400000))
          }
          onToday={() => {
            const today = new Date();
            const start = new Date(today);
            start.setDate(today.getDate() - today.getDay());
            setCurrentWeekStart(start);
            setSelectedDay(today.toISOString().split('T')[0]);
          }}
        />
      </div>

      <WeekAnalytics weekData={weekData} />

      <WeekView
        weekData={weekData}
        selectedDate={selectedDay}
        onSelectDay={(day) => setSelectedDay(day.date)}
      />

      <ReservationList
        dayLabel={selectedDayData?.label || ''}
        reservations={selectedDayData?.reservations || []}
        onSelect={setSelectedReservation}
      />

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onCancel={() => setSelectedReservation(null)}
          onMove={() => setSelectedReservation(null)}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}
