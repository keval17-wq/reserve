// ✅ components/calendar/CalendarView.tsx
'use client';

import React from 'react';
import { ReservationCard } from './reservationCard';

type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_time: string;
  reservation_date: string;
  table_number: number;
  persons: number;
  revenue: number;
  status: string;
};

type CalendarViewProps = {
  days: { date: string; reservations: Reservation[] }[];
  onSelectReservation: (res: Reservation) => void;
};

export const CalendarView = ({ days, onSelectReservation }: CalendarViewProps) => {
  if (!days.length) return <p className="text-gray-500">No reservations found.</p>;

  return (
    <div className="space-y-6">
      {days.map(({ date, reservations }) => (
        <div key={date}>
          <h3 className="text-md font-semibold text-gray-700 mb-2">{date}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reservations.map((r) => (
              <ReservationCard key={r.id} reservation={r} onClick={() => onSelectReservation(r)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


// // ✅ components/calendar/CalendarView.tsx
// 'use client';

// import React from 'react';
// import { ReservationCard } from './reservationCard';

// export const CalendarView = ({ days, onSelectReservation }: {
//   days: { date: string; reservations: any[] }[];
//   onSelectReservation: (res: any) => void;
// }) => {
//   if (!days.length) return <p className="text-gray-500">No reservations found.</p>;

//   return (
//     <div className="space-y-6">
//       {days.map(({ date, reservations }) => (
//         <div key={date}>
//           <h3 className="text-md font-semibold text-gray-700 mb-2">{date}</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {reservations.map((r) => (
//               <ReservationCard key={r.id} reservation={r} onClick={() => onSelectReservation(r)} />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };