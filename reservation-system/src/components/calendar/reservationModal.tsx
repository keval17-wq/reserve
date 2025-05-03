// ✅ components/calendar/ReservationModal.tsx
import React from 'react';

export const ReservationModal = ({ reservation, onCancel, onMove, onClose }: {
  reservation: any;
  onCancel: () => void;
  onMove: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
        <p className="text-gray-700">Customer: {reservation.customer_name}</p>
        <p className="text-gray-700">Table: {reservation.table_number}</p>
        <p className="text-gray-700 mb-4">Time: {new Date(reservation.reservation_time).toLocaleString()}</p>

        <div className="flex justify-between">
          <button onClick={onCancel} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={onMove} className="bg-yellow-500 text-white px-4 py-2 rounded">Move</button>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};