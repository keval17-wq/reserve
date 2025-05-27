// components/tables/reservationDetailModal.tsx

import React from 'react';
import { ReservationSummary } from '@/lib/supabase/tables';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  reservations: ReservationSummary[];
};

export const ReservationDetailModal = ({ isOpen, onClose, reservations }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Table Reservation Schedule</h2>
          <button onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600">
            ✕
          </button>
        </div>

        {reservations.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming reservations for this table.</p>
        ) : (
          <ul className="text-sm space-y-2 max-h-64 overflow-y-auto">
            {reservations.map((res) => (
              <li key={res.id} className="border-b pb-2">
                <div>
                  <span className="font-medium">{res.customer_name}</span> ({res.customer_email})
                </div>
                <div className="text-gray-500">
                  {new Date(res.time).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
