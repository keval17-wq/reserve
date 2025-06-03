// 'use client';
// import { useState } from 'react';
// import { type Reservation } from '@/lib/supabase/calendar';

// const TZ = 'Australia/Sydney';

// interface Props {
//   reservation: Reservation | null;
//   open: boolean;
//   onClose(): void;
//   onRefresh(): void;
// }

// export default function ReservationModal({
//   reservation,
//   open,
//   onClose,
//   onRefresh,
// }: Props) {
//   const [loading, setLoading] = useState(false);
//   if (!open || !reservation) return null;

//   async function callApi(endpoint: 'approve' | 'cancel') {
//     if (!reservation) {
//       throw new Error('Reservation is null');
//     }
//     const body = {
//       reservationId: reservation.id,
//       customerEmail: reservation.customer_email,
//       customerName: reservation.customer_name,
//       reservationDateTime: new Date(
//         reservation.reservation_time,
//       ).toLocaleString('en-AU', { timeZone: TZ }),
//       persons: reservation.persons,
//     };

//     const res = await fetch(`/api/reservations/${endpoint}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       const { error } = await res.json().catch(() => ({
//         error: res.statusText,
//       }));
//       throw new Error(error ?? 'Unknown error');
//     }
//   }

//   const handle = async (type: 'approve' | 'cancel') => {
//     setLoading(true);
//     try {
//       await callApi(type);
//       onRefresh();
//       onClose();
//     } catch (err: any) {
//       alert(`${type === 'approve' ? 'Approve' : 'Cancel'} failed: ${err.message}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const localDateTime = new Date(
//     reservation.reservation_time,
//   ).toLocaleString('en-AU', { timeZone: TZ });

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-[22rem] rounded-xl bg-white p-6">
//         <h3 className="mb-4 text-lg font-semibold">
//           Reservation&nbsp;#{reservation.id.slice(0, 8)}
//         </h3>

//         <p className="mb-2">
//           <strong>Name:</strong> {reservation.customer_name}
//         </p>
//         <p className="mb-2">
//           <strong>Date&nbsp;/&nbsp;Time:</strong> {localDateTime}
//         </p>
//         <p className="mb-6">
//           <strong>Persons:</strong> {reservation.persons}
//         </p>

//         <div className="flex justify-end gap-2">
//           <button
//             className="rounded border px-3 py-1"
//             onClick={onClose}
//             disabled={loading}
//           >
//             Close
//           </button>

//           {reservation.status !== 'cancelled' && (
//             <button
//               className="rounded bg-red-600 px-3 py-1 text-white"
//               onClick={() => handle('cancel')}
//               disabled={loading}
//             >
//               {loading ? '...' : 'Cancel'}
//             </button>
//           )}

//           {reservation.status !== 'confirmed' && (
//             <button
//               className="rounded bg-green-600 px-3 py-1 text-white"
//               onClick={() => handle('approve')}
//               disabled={loading}
//             >
//               {loading ? '...' : 'Approve'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



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

// export const ReservationModal = ({ reservation, onClose, onCancel }: Props) => {
//   const [approving, setApproving] = useState(false);
//   const [confirmed, setConfirmed] = useState(false);
//   const [cancelling, setCancelling] = useState(false);
//   const [cancelled, setCancelled] = useState(false);

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

//   const handleCancel = async () => {
//     setCancelling(true);
//     await supabase
//       .from('reservations')
//       .update({ status: 'cancelled' })
//       .eq('id', reservation.id);

//     await sendEmail({
//       reservationId: reservation.id,
//       toEmail: reservation.customer_email,
//       customerName: reservation.customer_name,
//       reservationDateTime: reservation.reservation_time,
//       partySize: 2,
//       type: 'cancel',
//     });

//     setCancelled(true);
//     setCancelling(false);
//     if (onCancel) onCancel();
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
//             disabled={approving || confirmed || cancelled}
//             onClick={handleApproval}
//           >
//             {confirmed ? 'Confirmed' : approving ? 'Approving...' : 'Approve'}
//           </button>
//           <button
//             className={`px-4 py-2 rounded ${
//               cancelled ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
//             }`}
//             disabled={cancelling || cancelled || confirmed}
//             onClick={handleCancel}
//           >
//             {cancelled ? 'Cancelled' : cancelling ? 'Cancelling...' : 'Cancel'}
//           </button>
//           <button onClick={onClose} className="text-sm text-gray-400 hover:underline">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

