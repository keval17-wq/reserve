'use client';

import React, { useEffect, useState } from 'react';
import { getAvailableTables, createReservation } from '@/lib/supabase/calendar';
import { createCustomerIfUnique } from '@/lib/supabase/customers';
import { sendEmail } from '@/lib/supabase/email';

export const NewReservationModal = ({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) => {
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState('18:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gap, setGap] = useState(30);
  const [availableTables, setAvailableTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [price, setPrice] = useState(0);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      const now = new Date();
      const selectedDateTime = new Date(`${date}T${time}`);
      if (partySize && selectedDateTime > now) {
        const tables = await getAvailableTables(date, time, partySize);
        setAvailableTables(tables);
      } else {
        setAvailableTables([]);
      }
    };
    fetchTables();
  }, [partySize, date, time]);

  const handleSubmit = async () => {
    if (!customerEmail || !customerName || !selectedTable) return;
    const reservationTime = `${date}T${time}`;

    setSubmitting(true);
    try {
      const customer_id = await createCustomerIfUnique(customerName, customerEmail);

      const { id: reservationId } = await createReservation({
        customer_id,
        table_id: selectedTable,
        reservation_time: reservationTime,
        price,
        special_instructions: specialInstructions,
      });

      await sendEmail({
        reservationId,
        toEmail: customerEmail,
        customerName,
        reservationDateTime: reservationTime,
        partySize,
        type: 'confirmation',
      });

      setSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (err) {
      console.error('Error submitting reservation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const start = 10 * 60;
    const end = 22 * 60;
    for (let mins = start; mins <= end; mins += gap) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const slotTime = new Date(`${date}T${label}`);
      if (slotTime > new Date()) slots.push(label);
    }
    return slots;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl space-y-4 shadow-xl border">
        <h2 className="text-xl font-semibold text-gray-800">New Reservation</h2>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <textarea
              placeholder="Special Instructions (optional)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full border rounded px-3 py-2 h-20"
            />

            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={partySize} onChange={(e) => setPartySize(+e.target.value)} placeholder="Party Size" className="border rounded px-2 py-2 w-full" />
              <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} placeholder="Price" className="border rounded px-2 py-2 w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-2 py-2 w-full" />
              <select value={time} onChange={(e) => setTime(e.target.value)} className="border rounded px-2 py-2 w-full">
                {generateTimeSlots().map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-500">Gap (min)</label>
                <select value={gap} onChange={(e) => setGap(+e.target.value)} className="border rounded px-2 py-1 text-sm">
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                </select>
              </div>
              <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Select Table</option>
              {availableTables.map((t) => (
                <option key={t.id} value={t.id}>Table {t.table_number} (Seats: {t.seats})</option>
              ))}
            </select>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 hover:underline">Back</button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${submitted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {submitted ? 'Success' : 'Submit'}
              </button>
            </div>
          </div>
        )}

        <div className="text-right pt-2">
          <button onClick={onClose} className="text-sm text-gray-400 hover:underline">Cancel</button>
        </div>
      </div>
    </div>
  );
};
