'use client';

import React from 'react';
import { Reservation } from '@/lib/supabase/calendar';

type Props = {
  dayLabel: string;
  reservations: Reservation[];
  onSelect: (reservation: Reservation) => void;
};

export const ReservationList = ({ dayLabel, reservations, onSelect }: Props) => {
  return (
    <div className="mt-6 bg-white border rounded-lg shadow-sm p-4 w-full overflow-x-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
        Reservations for {dayLabel}
      </h2>

      {reservations.length === 0 ? (
        <p className="text-sm text-gray-500">No reservations found.</p>
      ) : (
        <ul className="space-y-3">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(res)}
            >
              <div className="text-sm font-medium text-gray-800">
                {res.customer_name}
              </div>
              <div className="text-sm text-gray-600">
                Table {res.table_number} — {new Date(res.reservation_time).toLocaleTimeString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


// // ✅ components/calendar/reservationList.tsx
// 'use client';

// import React from 'react';
// import { Reservation } from '@/lib/supabase/calendar';

// type Props = {
//   dayLabel: string;
//   reservations: Reservation[];
//   onSelect: (reservation: Reservation) => void;
// };

// export const ReservationList = ({ dayLabel, reservations, onSelect }: Props) => {
//   return (
//     <div className="mt-6 bg-white border rounded-lg shadow-sm p-4">
//       <h2 className="text-lg font-semibold mb-3 text-gray-800">
//         Reservations for {dayLabel}
//       </h2>

//       {reservations.length === 0 ? (
//         <p className="text-sm text-gray-500">No reservations found.</p>
//       ) : (
//         <ul className="space-y-3">
//           {reservations.map((res) => (
//             <li
//               key={res.id}
//               className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
//               onClick={() => onSelect(res)}
//             >
//               <div className="text-sm font-medium text-gray-800">
//                 {res.customer_name}
//               </div>
//               <div className="text-sm text-gray-600">
//                 Table {res.table_number} &mdash; {new Date(res.reservation_time).toLocaleTimeString()}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
