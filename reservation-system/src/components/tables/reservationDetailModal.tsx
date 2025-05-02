'use client';

import React from 'react';

type Reservation = {
  id: string;
  customer_name: string;
  time: string;
};

type Props = {
  reservation: Reservation;
  onCancel: () => void;
  onClose: () => void;
};

export const ReservationDetailModal = ({ reservation, onCancel, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-lg font-bold">Reservation Details</h2>
        <p><strong>Name:</strong> {reservation.customer_name}</p>
        <p><strong>Time:</strong> {reservation.time}</p>

        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onCancel} className="text-red-600">Cancel Reservation</button>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};
