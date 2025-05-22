'use client';

import React from 'react';

export type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

type DayReservation = {
  label: string;
  date: string;
  reservations: Reservation[];
};

type Props = {
  weekData: DayReservation[];
  selectedDate: string;
  onSelectDay: (day: DayReservation) => void;
};

export const WeekView = ({ weekData, selectedDate, onSelectDay }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {weekData.map((day) => {
        const isSelected = day.date === selectedDate;

        return (
          <div
            key={day.date}
            onClick={() => onSelectDay(day)}
            className={`p-4 border rounded cursor-pointer transition hover:bg-blue-50 ${
              isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white'
            }`}
          >
            <h3 className="text-sm font-medium text-gray-700 mb-2">{day.label}</h3>
            {day.reservations.length > 0 ? (
              day.reservations.map((res) => (
                <div
                  key={res.id}
                  className="text-sm text-gray-800 bg-gray-100 rounded p-2 mb-1"
                >
                  <p className="font-semibold truncate">{res.customer_name}</p>
                  <p className="text-xs text-gray-600 truncate">
                    Table {res.table_number} — {new Date(res.reservation_time).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No reservations</p>
            )}
          </div>
        );
      })}
    </div>
  );
};


// 'use client';

// import React from 'react';

// export type Reservation = {
//   id: string;
//   customer_name: string;
//   reservation_time: string;
//   table_number: number;
// };

// type DayReservation = {
//   label: string;
//   date: string;
//   reservations: Reservation[];
// };

// type Props = {
//   weekData: DayReservation[];
//   selectedDate: string;
//   onSelectDay: (day: DayReservation) => void;
// };

// export const WeekView = ({ weekData, selectedDate, onSelectDay }: Props) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//       {weekData.map((day) => {
//         const isSelected = day.date === selectedDate;

//         return (
//           <div
//             key={day.date}
//             onClick={() => onSelectDay(day)}
//             className={`p-4 border rounded cursor-pointer transition hover:bg-blue-50 ${
//               isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white'
//             }`}
//           >
//             <h3 className="text-sm font-medium text-gray-700 mb-2">{day.label}</h3>
//             {day.reservations.length > 0 ? (
//               day.reservations.map((res) => (
//                 <div
//                   key={res.id}
//                   className="text-sm text-gray-800 bg-gray-100 rounded p-2 mb-1"
//                 >
//                   <p className="font-semibold">{res.customer_name}</p>
//                   <p className="text-xs text-gray-600">
//                     Table {res.table_number} — {new Date(res.reservation_time).toLocaleTimeString()}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-xs text-gray-400 italic">No reservations</p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };
