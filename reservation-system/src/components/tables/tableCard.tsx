'use client';

import React from 'react';

type ReservationSummary = {
  id: string;
  time: string;
  customer_name: string;
  customer_email: string;
};

type Props = {
  tableNumber: number;
  status: string;
  seats: number;
  reservations: ReservationSummary[];
  onCancel: (
    reservationId: string,
    email: string,
    name: string,
    time: string,
    partySize: number
  ) => void;
};

export const TableCard: React.FC<Props> = ({
  tableNumber,
  status,
  seats,
  reservations,
  onCancel,
}) => {
  const statusColor =
    status === 'available'
      ? 'bg-green-100 text-green-700'
      : status === 'reserved'
      ? 'bg-yellow-100 text-yellow-700'
      : status === 'occupied'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Table #{tableNumber}</h2>
        <span className={`rounded px-2 py-1 text-xs font-medium ${statusColor}`}>{status}</span>
      </div>

      <p className="text-sm text-gray-500">Seats: {seats}</p>

      <div>
        <h4 className="text-sm font-semibold">Upcoming</h4>
        {reservations.length === 0 ? (
          <p className="text-xs text-gray-400">No reservations</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {reservations.map((res) => (
              <li key={res.id} className="border-b pb-2">
                <div className="font-medium">{res.customer_name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(res.time).toLocaleString()}
                </div>
                <button
                  onClick={() =>
                    onCancel(
                      res.id,
                      res.customer_email,
                      res.customer_name,
                      res.time,
                      seats
                    )
                  }
                  className="mt-1 text-xs text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


// // components/tables/tableCard.tsx

// 'use client';

// import React from 'react';

// type Props = {
//   id: string;
//   tableNumber: number;
//   status: string;
//   seats: number;
//   reservations: {
//     id: string;
//     time: string;
//     customer_name: string;
//     customer_email: string;
//   }[];
//   onCancel: (
//     reservationId: string,
//     email: string,
//     name: string,
//     time: string,
//     partySize: number
//   ) => void;
// };

// export const TableCard = ({
//   id,
//   tableNumber,
//   status,
//   seats,
//   reservations,
//   onCancel,
// }: Props) => {
//   const statusColor =
//     status === 'available'
//       ? 'bg-green-100 text-green-700'
//       : status === 'reserved'
//       ? 'bg-yellow-100 text-yellow-700'
//       : status === 'occupied'
//       ? 'bg-blue-100 text-blue-700'
//       : 'bg-red-100 text-red-700';

//   return (
//     <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-semibold">Table #{tableNumber}</h2>
//         <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
//           {status}
//         </span>
//       </div>

//       <div className="text-sm text-gray-500">Seats: {seats}</div>

//       <div>
//         <h4 className="text-sm font-semibold">Upcoming Reservations</h4>
//         {reservations.length === 0 ? (
//           <p className="text-xs text-gray-400">No reservations</p>
//         ) : (
//           <ul className="text-sm space-y-2 mt-2">
//             {reservations.map((res) => (
//               <li key={res.id} className="border-b pb-2">
//                 <div className="font-medium">{res.customer_name}</div>
//                 <div className="text-xs text-gray-500">
//                   {new Date(res.time).toLocaleString()}
//                 </div>
//                 <button
//                   onClick={() =>
//                     onCancel(
//                       res.id,
//                       res.customer_email,
//                       res.customer_name,
//                       res.time,
//                       seats
//                     )
//                   }
//                   className="text-xs text-red-600 hover:underline mt-1"
//                 >
//                   Cancel
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };
