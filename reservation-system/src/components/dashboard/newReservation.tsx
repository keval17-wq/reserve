// src/components/dashboard/newReservation.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  getAvailableTables,
  createReservation,
  getRandomAvailableTable,
} from '@/lib/supabase/calendar';
import { createCustomerIfUnique } from '@/lib/supabase/customers';
import { XIcon, CheckCircleIcon } from '@heroicons/react/outline';

type Table = {
  id: string;
  table_number: number | null;
  seats: number;
};

type Props = {
  onClose: () => void;
  onComplete: () => void;
};

export const NewReservationModal: React.FC<Props> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [price, setPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /** ──────────────────────────────────────────────────────────────────────────
   *  Fetch available tables whenever party size / date / time changes
   *  ────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchTables = async () => {
      const now = new Date();
      const desiredDateTime = new Date(`${date}T${time}`);
      if (partySize > 0 && desiredDateTime > now) {
        const available = await getAvailableTables(date, time, partySize);
        setTables(
          available.map((t: { id: string; table_number: number | null; seats: number }) => ({
            id: t.id,
            table_number: t.table_number ?? 0,
            seats: t.seats,
          }))
        );
      } else {
        setTables([]);
      }
    };
    fetchTables();
  }, [partySize, date, time]);

  const next = () => setStep(2);
  const back = () => setStep(1);

  /** ──────────────────────────────────────────────────────────────────────────
   *  Submit reservation & trigger confirmation email via API route
   *  ────────────────────────────────────────────────────────────────────────── */
  const submit = async () => {
    setLoading(true);
    try {
      const custId = await createCustomerIfUnique(customerName, customerEmail);
      const tableId = selectedTable || (await getRandomAvailableTable(date, time, partySize))!;
      if (!tableId) throw new Error('No tables available');

      const { id: resId } = await createReservation({
        customer_id: custId,
        table_id: tableId,
        reservation_time: `${date}T${time}`,
        price,
        special_instructions: notes,
      });

      // ✅ Browser-side call to API route (no direct import of sendEmail)
      await fetch('/api/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: resId,
          toEmail: customerEmail,
          customerName,
          reservationDateTime: `${date}T${time}`,
          partySize,
          type: 'confirmation',
        }),
      });


      setSuccess(true);
      setTimeout(onComplete, 1200);
    } catch {
      alert('Something went wrong, please retry.');
    } finally {
      setLoading(false);
    }
  };

  /** ──────────────────────────────────────────────────────────────────────────
   *  Helper: generate 30-minute time slots from 10:00 to 22:00, future-only
   *  ────────────────────────────────────────────────────────────────────────── */
  const generateSlots = () => {
    const slots: string[] = [];
    for (let m = 600; m <= 1320; m += 30) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const slot = `${hh}:${mm}`;
      if (new Date(`${date}T${slot}`) > new Date()) slots.push(slot);
    }
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">New Reservation</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'} transition-colors`} />
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="px-6 py-8 space-y-6">
          {step === 1 ? (
            /* ──────────── Step 1: Customer & basic info ──────────── */
            <div className="grid gap-6">
              {/* Name & email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              {/* Party size, price, notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Party Size</label>
                  <input
                    type="number"
                    min={1}
                    value={partySize}
                    onChange={(e) => setPartySize(+e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step={0.01}
                    value={price}
                    onChange={(e) => setPrice(+e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                    placeholder="Allergies, preferences…"
                  />
                </div>
              </div>

              {/* Date & time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                  >
                    {generateSlots().map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Next button */}
              <div className="text-right">
                <button
                  onClick={next}
                  disabled={!customerName || !customerEmail}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            /* ──────────── Step 2: Choose table & confirm ──────────── */
            <div className="space-y-6">
              {/* Table dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Table</label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Auto-assign best fit</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table {t.table_number ?? 'N/A'} (Seats: {t.seats})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <button onClick={back} className="text-sm text-gray-600 hover:underline">
                  ← Back
                </button>
                <button
                  onClick={submit}
                  disabled={loading || success}
                  className={`inline-flex items-center px-6 py-2 rounded-lg text-white transition 
                    ${success
                      ? 'bg-green-600'
                      : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'}`}
                >
                  {loading ? '…Submitting' : success ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-1" /> Done
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// // src/components/dashboard/newReservation.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   getAvailableTables,
//   createReservation,
//   getRandomAvailableTable,
// } from '@/lib/supabase/calendar';
// import { createCustomerIfUnique } from '@/lib/supabase/customers';
// // ↓ Remove this line:
// // import { sendEmail } from '@/lib/supabase/email';
// import { XIcon, CheckCircleIcon } from '@heroicons/react/outline';

// type Table = {
//   id: string;
//   table_number: number | null;
//   seats: number;
// };

// type Props = {
//   onClose: () => void;
//   onComplete: () => void;
// };

// export const NewReservationModal: React.FC<Props> = ({ onClose, onComplete }) => {
//   const [step, setStep] = useState<1 | 2>(1);
//   const [partySize, setPartySize] = useState(2);
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
//   const [time, setTime] = useState('18:00');
//   const [tables, setTables] = useState<Table[]>([]);
//   const [selectedTable, setSelectedTable] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [customerEmail, setCustomerEmail] = useState('');
//   const [price, setPrice] = useState(0);
//   const [notes, setNotes] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const fetchTables = async () => {
//       const now = new Date();
//       const desiredDateTime = new Date(`${date}T${time}`);
//       if (partySize > 0 && desiredDateTime > now) {
//         const available = await getAvailableTables(date, time, partySize);
//         setTables(
//           available.map((t: { id: string; table_number: number | null; seats: number }) => ({
//             id: t.id,
//             table_number: t.table_number ?? 0,
//             seats: t.seats,
//           }))
//         );
//       } else {
//         setTables([]);
//       }
//     };
//     fetchTables();
//   }, [partySize, date, time]);

//   const next = () => setStep(2);
//   const back = () => setStep(1);

//   const submit = async () => {
//     setLoading(true);
//     try {
//       const custId = await createCustomerIfUnique(customerName, customerEmail);
//       const tableId = selectedTable || (await getRandomAvailableTable(date, time, partySize))!;
//       if (!tableId) throw new Error('No tables available');

//       const { id: resId } = await createReservation({
//         customer_id: custId,
//         table_id: tableId,
//         reservation_time: `${date}T${time}`,
//         price,
//         special_instructions: notes,
//       });

//       // → Instead of sendEmail(...), make a POST to your API route:
//       await fetch('/api/confirmation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           reservationId: resId,
//           toEmail: customerEmail,
//           customerName,
//           reservationDateTime: `${date}T${time}`,
//           partySize,
//           type: 'confirmation',
//         }),
//       });

//       setSuccess(true);
//       setTimeout(onComplete, 1200);
//     } catch {
//       alert('Something went wrong, please retry.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateSlots = () => {
//     const s: string[] = [];
//     for (let m = 600; m <= 1320; m += 30) {
//       const hh = String(Math.floor(m / 60)).padStart(2, '0');
//       const mm = String(m % 60).padStart(2, '0');
//       const t = `${hh}:${mm}`;
//       if (new Date(`${date}T${t}`) > new Date()) s.push(t);
//     }
//     return s;
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
//         <div className="flex justify-between items-center px-6 py-4 border-b">
//           <h3 className="text-2xl font-semibold text-gray-800">New Reservation</h3>
//           <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
//             <XIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="flex">
//           {[1, 2].map((i) => (
//             <div key={i} className="flex-1">
//               <div className={`h-2 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'} transition-colors`} />
//             </div>
//           ))}
//         </div>

//         <div className="px-6 py-8 space-y-6">
//           {step === 1 ? (
//             <div className="grid gap-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Jane Doe"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={customerEmail}
//                     onChange={(e) => setCustomerEmail(e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="jane@example.com"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Party Size</label>
//                   <input
//                     type="number"
//                     min={1}
//                     value={partySize}
//                     onChange={(e) => setPartySize(+e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Price ($)</label>
//                   <input
//                     type="number"
//                     step={0.01}
//                     value={price}
//                     onChange={(e) => setPrice(+e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Notes</label>
//                   <input
//                     type="text"
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2"
//                     placeholder="Allergies, preferences..."
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Time</label>
//                   <select
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="mt-1 w-full border rounded-lg px-3 py-2"
//                   >
//                     {generateSlots().map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <button
//                   onClick={next}
//                   disabled={!customerName || !customerEmail}
//                   className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Table</label>
//                 <select
//                   value={selectedTable}
//                   onChange={(e) => setSelectedTable(e.target.value)}
//                   className="mt-1 w-full border rounded-lg px-3 py-2"
//                 >
//                   <option value="">Auto-assign best fit</option>
//                   {tables.map((t) => (
//                     <option key={t.id} value={t.id}>
//                       Table {t.table_number ?? 'N/A'} (Seats: {t.seats})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex justify-between items-center">
//                 <button onClick={back} className="text-sm text-gray-600 hover:underline">
//                   ← Back
//                 </button>
//                 <button
//                   onClick={submit}
//                   disabled={loading || success}
//                   className={`inline-flex items-center px-6 py-2 rounded-lg text-white transition 
//                     ${success
//                       ? 'bg-green-600'
//                       : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50'}`}
//                 >
//                   {loading ? '…Submitting' : success ? <><CheckCircleIcon className="h-5 w-5 mr-1" /> Done</> : 'Confirm'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
