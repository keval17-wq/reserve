// components/tables/addTableModal.tsx

import React, { useState } from 'react';
import { addTable } from '@/lib/supabase/tables';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTableAdded: () => void;
};

export const AddTableModal = ({ isOpen, onClose, onTableAdded }: Props) => {
  const [tableNumber, setTableNumber] = useState('');
  const [seats, setSeats] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addTable(Number(tableNumber), seats);
    setLoading(false);
    onTableAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Add New Table</h2>
        <input
          type="number"
          placeholder="Table Number"
          className="w-full border p-2 rounded"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <input
          type="number"
          placeholder="Seats"
          className="w-full border p-2 rounded"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Table'}
        </button>
        <button onClick={onClose} className="text-sm text-gray-500 hover:underline w-full text-center">
          Cancel
        </button>
      </div>
    </div>
  );
};
