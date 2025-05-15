// ✅ app/calendar/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getReservationsByMonth } from '@/lib/supabase/calendar';
import { WeekView } from '@/components/calendar/weekView';
import { ReservationModal } from '@/components/calendar/reservationModal';

type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Sunday start
    return start;
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth() + 1;
      const result = await getReservationsByMonth(year, month);
      setReservations(result as Reservation[]);
    };

    fetchReservations();
  }, [currentWeekStart]);

  const getWeekData = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(currentWeekStart);
      dayDate.setDate(currentWeekStart.getDate() + i);
      const isoDate = dayDate.toISOString().split('T')[0];

      return {
        date: dayDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        reservations: reservations.filter((r) =>
          r.reservation_time.startsWith(isoDate)
        ),
      };
    });

    return days;
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const goToPrevWeek = () => {
    setCurrentWeekStart((prev) => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen text-black">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weekly Reservations</h1>
        <div className="space-x-2">
          <button
            onClick={goToPrevWeek}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            ← Previous
          </button>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Next →
          </button>
        </div>
      </div>

      <WeekView
        weekData={getWeekData()}
        onSelectReservation={setSelectedReservation}
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
// import { getReservationsByMonth } from '@/lib/supabase/calendar';
// import { WeekView } from '@/components/calendar/weekView';
// import { ReservationModal } from '@/components/calendar/reservationModal';

// type Reservation = {
//   id: string;
//   customer_name: string;
//   reservation_time: string;
//   table_number: number;
// };

// export default function CalendarPage() {
//   const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
//     const today = new Date();
//     return new Date(today.setDate(today.getDate() - today.getDay()));
//   });
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

//   useEffect(() => {
//     const fetchReservations = async () => {
//       const year = currentWeekStart.getFullYear();
//       const month = currentWeekStart.getMonth() + 1;
//       const result = await getReservationsByMonth(year, month);
//       setReservations(result as Reservation[]);
//     };

//     fetchReservations();
//   }, [currentWeekStart]);

//   const getWeekData = (): {
//     date: string;
//     reservations: Reservation[];
//   }[] => {
//     const days = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date(currentWeekStart);
//       date.setDate(currentWeekStart.getDate() + i);
//       const dateStr = date.toISOString().split('T')[0];
//       return {
//         date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
//         reservations: reservations.filter((r) =>
//           r.reservation_time.startsWith(dateStr)
//         ),
//       };
//     });
//     return days;
//   };

//   const goToNextWeek = () => {
//     setCurrentWeekStart((prev) => new Date(prev.setDate(prev.getDate() + 7)));
//   };

//   const goToPrevWeek = () => {
//     setCurrentWeekStart((prev) => new Date(prev.setDate(prev.getDate() - 7)));
//   };

//   return (
//     <div className="p-6 space-y-6 bg-white min-h-screen text-black">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Weekly Reservations</h1>
//         <div className="space-x-2">
//           <button onClick={goToPrevWeek} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">
//             ← Previous
//           </button>
//           <button onClick={goToNextWeek} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">
//             Next →
//           </button>
//         </div>
//       </div>

//       <WeekView weekData={getWeekData()} onSelectReservation={setSelectedReservation} />

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

