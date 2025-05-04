'use client';

import React from 'react';

type Reservation = {
  id: string;
  customer_name: string;
  time: string;
};

type Props = {
  tableNumber: number;
  status: string;
  seats: number;
  reservations: Reservation[];
  onView: (res: Reservation) => void;
};

export const TableCard = ({ tableNumber, status, seats, reservations, onView }: Props) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Table {tableNumber}</h2>
        <span
          className={`px-2 py-1 text-xs rounded ${
            status === 'occupied'
              ? 'bg-blue-100 text-blue-800'
              : status === 'available'
              ? 'bg-green-100 text-green-800'
              : status === 'reserved'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-500">Seats: {seats}</p>

      <div className="space-y-1">
        {reservations.length === 0 ? (
          <p className="text-sm text-gray-400">No reservations</p>
        ) : (
          reservations.map((res) => (
            <div
              key={res.id}
              className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded text-sm"
            >
              <span>{res.customer_name}</span>
              <button
                className="text-blue-600 hover:underline text-xs"
                onClick={() => onView(res)}
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
