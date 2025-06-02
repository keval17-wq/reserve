'use client';
import React, { useState } from 'react';
import { sendEmail } from '@/lib/supabase/email';
import { supabase } from '@/lib/supabaseClient';
import { Reservation } from '@/lib/supabase/calendar';

interface Props {
  reservation: Reservation;
  onClose: () => void;
  onCancel: () => void;
  onMove: () => void;
}

export const ReservationModal = ({ reservation, onClose, onCancel }: Props) => {
  const [approving, setApproving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const handleApproval = async () => {
    setApproving(true);
    await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservation.id);

    await sendEmail({
      reservationId: reservation.id,
      toEmail: reservation.customer_email,
      customerName: reservation.customer_name,
      reservationDateTime: reservation.reservation_time,
      partySize: 2,
      type: 'confirmation',
    });

    setConfirmed(true);
    setApproving(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservation.id);

    await sendEmail({
      reservationId: reservation.id,
      toEmail: reservation.customer_email,
      customerName: reservation.customer_name,
      reservationDateTime: reservation.reservation_time,
      partySize: 2,
      type: 'cancel',
    });

    setCancelled(true);
    setCancelling(false);
    if (onCancel) onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold">{reservation.customer_name}</h2>
        <p className="text-sm text-gray-600">
          {new Date(reservation.reservation_time).toLocaleString()} — Table {reservation.table_number}
        </p>

        <div className="flex justify-between pt-4">
          <button
            className={`px-4 py-2 rounded ${
              confirmed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={approving || confirmed || cancelled}
            onClick={handleApproval}
          >
            {confirmed ? 'Confirmed' : approving ? 'Approving...' : 'Approve'}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              cancelled ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
            disabled={cancelling || cancelled || confirmed}
            onClick={handleCancel}
          >
            {cancelled ? 'Cancelled' : cancelling ? 'Cancelling...' : 'Cancel'}
          </button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:underline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 'use client';
// import React, { useState } from 'react';
// import { sendEmail } from '@/lib/supabase/email';
// import { supabase } from '@/lib/supabaseClient';
// import { Reservation } from '@/lib/supabase/calendar';

// interface Props {
//   reservation: Reservation;
//   onClose: () => void;
//   onCancel: () => void;
//   onMove: () => void;
// }

// export const ReservationModal = ({ reservation, onClose }: Props) => {
//   const [approving, setApproving] = useState(false);
//   const [confirmed, setConfirmed] = useState(false);

//   const handleApproval = async () => {
//     setApproving(true);
//     await supabase
//       .from('reservations')
//       .update({ status: 'confirmed' })
//       .eq('id', reservation.id);

//     await sendEmail({
//       reservationId: reservation.id,
//       toEmail: reservation.customer_email,
//       customerName: reservation.customer_name,
//       reservationDateTime: reservation.reservation_time,
//       partySize: 2,
//       type: 'confirmation',
//     });

//     setConfirmed(true);
//     setApproving(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
//       <div className="bg-white p-6 rounded-xl max-w-md w-full space-y-4">
//         <h2 className="text-xl font-semibold">{reservation.customer_name}</h2>
//         <p className="text-sm text-gray-600">
//           {new Date(reservation.reservation_time).toLocaleString()} — Table {reservation.table_number}
//         </p>

//         <div className="flex justify-between pt-4">
//           <button
//             className={`px-4 py-2 rounded ${
//               confirmed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//             disabled={approving || confirmed}
//             onClick={handleApproval}
//           >
//             {confirmed ? 'Confirmed' : approving ? 'Approving...' : 'Approve'}
//           </button>
//           <button onClick={onClose} className="text-sm text-gray-400 hover:underline">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
