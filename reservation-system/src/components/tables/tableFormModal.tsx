'use client';

import { useState } from 'react';

export const TableFormModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (tableNumber: number, seats: number) => void;
}) => {
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [seats, setSeats] = useState<number>(2);

  const handleSubmit = () => {
    onSubmit(tableNumber, seats);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Add New Table</h2>

        <input
          type="number"
          className="border rounded px-3 py-2 w-full"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(parseInt(e.target.value))}
        />

        <input
          type="number"
          className="border rounded px-3 py-2 w-full"
          placeholder="Seats"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Table
          </button>
        </div>
      </div>
    </div>
  );
};
