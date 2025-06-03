'use client';
import React, { useState } from 'react';
import { ReservationSummary, cancelReservationById } from '@/lib/supabase/tables';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reservations: ReservationSummary[];
  onReservationCancelled?: (id: string) => void;
};

export const ReservationDetailModal = ({
  isOpen,
  onClose,
  reservations,
  onReservationCancelled,
}: Props) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancel = async (res: ReservationSummary) => {
    setLoadingId(res.id);
    setSentId(null);

    try {
      // 1. Cancel reservation in DB
      await cancelReservationById(res.id);

      // 2. Send cancellation email via API route
      await fetch('/api/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: res.id,
          toEmail: res.customer_email,
          customerName: res.customer_name,
          reservationDateTime: new Date(res.time).toISOString(),

          type: 'cancel',
        }),
      });

      setSentId(res.id);

      // 3. Remove from UI (call parent callback if provided)
      if (onReservationCancelled) onReservationCancelled(res.id);
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert('Cancellation failed: ' + (err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  // Optionally filter out cancelled reservations if status is present
  const visibleReservations = reservations.filter(
    (r: any) => !r.status || r.status !== 'cancelled'
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Table Reservation Schedule</h2>
          <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600">
            ✕
          </button>
        </div>

        {visibleReservations.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming reservations for this table.</p>
        ) : (
          <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
            {visibleReservations.map((res) => (
              <li key={res.id} className="border-b pb-2 space-y-1">
                <div>
                  <span className="font-medium">{res.customer_name}</span> ({res.customer_email})
                </div>
                <div className="text-gray-500">{new Date(res.time).toLocaleString()}</div>
                <button
                  onClick={() => handleCancel(res)}
                  disabled={loadingId === res.id}
                  className={`mt-1 text-xs px-3 py-1 rounded ${sentId === res.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                >
                  {loadingId === res.id
                    ? 'Sending...'
                    : sentId === res.id
                      ? 'Cancelled'
                      : 'Send Cancellation'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// // components/tables/reservationDetailModal.tsx

// 'use client';
// import React, { useState } from 'react';
// import { ReservationSummary } from '@/lib/supabase/tables';

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   reservations: ReservationSummary[];
// };

// export const ReservationDetailModal = ({ isOpen, onClose, reservations }: Props) => {
//   const [loadingId, setLoadingId] = useState<string | null>(null);
//   const [sentId, setSentId] = useState<string | null>(null);

//   if (!isOpen) return null;

//   const sendCancelEmail = async (res: ReservationSummary) => {
//     setLoadingId(res.id);
//     setSentId(null);

//     const payload = {
//       reservationId: res.id,
//       toEmail: res.customer_email,
//       customerName: res.customer_name,
//       reservationDateTime: new Date(res.time).toISOString(),
//       type: 'cancel',
//     };

//     try {
//       const response = await fetch('/api/confirmation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setSentId(res.id);
//       } else {
//         console.error('Email failed:', data.error);
//         alert('Failed to send email.');
//       }
//     } catch (err) {
//       console.error('Email send error:', err);
//       alert('An error occurred.');
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Table Reservation Schedule</h2>
//           <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600">
//             ✕
//           </button>
//         </div>

//         {reservations.length === 0 ? (
//           <p className="text-sm text-gray-500">No upcoming reservations for this table.</p>
//         ) : (
//           <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
//             {reservations.map((res) => (
//               <li key={res.id} className="border-b pb-2 space-y-1">
//                 <div>
//                   <span className="font-medium">{res.customer_name}</span> ({res.customer_email})
//                 </div>
//                 <div className="text-gray-500">{new Date(res.time).toLocaleString()}</div>
//                 <button
//                   onClick={() => sendCancelEmail(res)}
//                   disabled={loadingId === res.id}
//                   className={`mt-1 text-xs px-3 py-1 rounded ${sentId === res.id
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-red-100 hover:bg-red-200 text-red-700'
//                     }`}
//                 >
//                   {loadingId === res.id
//                     ? 'Sending...'
//                     : sentId === res.id
//                       ? 'Cancelled'
//                       : 'Send Cancellation'}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

