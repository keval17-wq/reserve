'use client';

import React, { useState } from 'react';
import { AvailableTablesDropdown } from './availableTablesDropdown';

export const CreateReservationModal = ({ onClose }: { onClose: () => void }) => {
  const [partySize, setPartySize] = useState(2);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h3 className="text-lg font-bold">New Reservation</h3>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          placeholder="Party size"
          value={partySize}
          onChange={(e) => setPartySize(parseInt(e.target.value))}
        />
        <AvailableTablesDropdown partySize={partySize} />
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};
