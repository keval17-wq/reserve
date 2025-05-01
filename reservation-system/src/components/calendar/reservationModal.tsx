'use client';

import React from 'react';

type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

export const ReservationModal = ({
  reservation,
  onClose,
  onCancel,
  onMove,
}: {
  reservation: Reservation;
  onClose: () => void;
  onCancel: () => void;
  onMove: () => void;
}) => {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Reservation for {reservation.customer_name}</h3>
        <p className="text-sm mb-2">Table: {reservation.table_number}</p>
        <p className="text-sm mb-4">Time: {new Date(reservation.reservation_time).toLocaleString()}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="text-red-600">Cancel</button>
          <button onClick={onMove} className="text-blue-600">Move</button>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};
