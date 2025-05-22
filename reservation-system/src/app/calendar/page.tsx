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
        reservations: reservations.filter(r =>
          r.reservation_time.startsWith(iso)
        ),
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


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { getReservationsByMonth, Reservation } from '@/lib/supabase/calendar';
// import { WeekView } from '@/components/calendar/weekView';
// import { ReservationModal } from '@/components/calendar/reservationModal';

// export default function CalendarPage() {
//   const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
//     const today = new Date();
//     const start = new Date(today);
//     start.setDate(today.getDate() - today.getDay()); // Sunday as start of week
//     return start;
//   });

//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
//   const [selectedDay, setSelectedDay] = useState<string>(() => {
//     return new Date().toISOString().split('T')[0]; // today by default
//   });

//   useEffect(() => {
//     const fetchReservations = async () => {
//       const year = currentWeekStart.getFullYear();
//       const month = currentWeekStart.getMonth() + 1;
//       const result = await getReservationsByMonth(year, month);
//       setReservations(result);
//     };

//     fetchReservations();
//   }, [currentWeekStart]);

//   const getWeekData = () => {
//     return Array.from({ length: 7 }, (_, i) => {
//       const dayDate = new Date(currentWeekStart);
//       dayDate.setDate(currentWeekStart.getDate() + i);
//       const iso = dayDate.toISOString().split('T')[0];
//       const todayIso = new Date().toISOString().split('T')[0];

//       return {
//         iso,
//         date: dayDate.toLocaleDateString('en-US', {
//           weekday: 'long',
//           month: 'short',
//           day: 'numeric',
//         }),
//         isToday: iso === todayIso,
//         isSelected: iso === selectedDay,
//         reservations: reservations.filter((r) =>
//           r.reservation_time.startsWith(iso)
//         ),
//       };
//     });
//   };

//   const goToNextWeek = () => {
//     setCurrentWeekStart((prev) => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
//   };

//   const goToPrevWeek = () => {
//     setCurrentWeekStart((prev) => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
//   };

//   return (
//     <div className="p-6 space-y-6 bg-white min-h-screen text-black">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Calendar</h1>
//         <div className="space-x-2">
//           <button
//             onClick={goToPrevWeek}
//             className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
//           >
//             ← Previous
//           </button>
//           <button
//             onClick={goToNextWeek}
//             className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
//           >
//             Next →
//           </button>
//         </div>
//       </div>

//       <WeekView
//         weekData={getWeekData()}
//         onSelectReservation={setSelectedReservation}
//       />

//       {selectedReservation && (
//         <ReservationModal
//           reservation={selectedReservation}
//           onCancel={() => setSelectedReservation(null)}
//           onMove={() => setSelectedReservation(null)}
//           onClose={() => setSelectedReservation(null)}
//         />
//       )}
//     </div>
//   );
// }

