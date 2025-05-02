'use client';

import React, { useState } from 'react';

type Props = {
  existingNumbers: number[];
  onAdd: (tableNumber: number, seats: number) => void;
  onClose: () => void;
};

export const AddTableModal = ({ existingNumbers, onAdd, onClose }: Props) => {
  const [number, setNumber] = useState<number>(0);
  const [seats, setSeats] = useState<number>(4);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (existingNumbers.includes(number)) {
      setError('Table number already exists.');
      return;
    }
    onAdd(number, seats);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Add New Table</h2>

        <input
          type="number"
          className="w-full border rounded px-3 py-1"
          placeholder="Table Number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value))}
        />
        <input
          type="number"
          className="w-full border rounded px-3 py-1"
          placeholder="Seats"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-2 pt-2">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-1 rounded">
            Add Table
          </button>
        </div>
      </div>
    </div>
  );
};
