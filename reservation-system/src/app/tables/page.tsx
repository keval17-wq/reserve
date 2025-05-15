// ✅ /app/tables/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  getTablesWithReservations,
  addTable,
  cancelReservationById,
} from '@/lib/supabase/tables';
import { TableCard } from '@/components/tables/tableCard';
import { AddTableModal } from '@/components/tables/addTableModal';
import { ReservationDetailModal } from '@/components/tables/reservationDetailModal';

type Reservation = {
  id: string;
  time: string;
  customer_name: string;
};

type TableData = {
  id: string;
  tableNumber: number;
  seats: number;
  status: string;
  reservations: Reservation[];
};

export default function TablesPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const fetchTables = async () => {
    try {
      const data = await getTablesWithReservations();
      setTables(data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (tableNumber: number, seats: number) => {
    try {
      await addTable(tableNumber, seats);
      await fetchTables();
    } catch (err) {
      console.error('Failed to add table:', err);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await cancelReservationById(id);
      setSelectedReservation(null);
      await fetchTables();
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white text-black">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tables</h1>
          <p className="text-sm text-gray-600">Manage restaurant tables and view live reservations.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            tableNumber={table.tableNumber}
            status={table.status}
            seats={table.seats}
            reservations={table.reservations}
            onView={(res) => setSelectedReservation(res)}
          />
        ))}
      </div>

      {showAddModal && (
        <AddTableModal
          existingNumbers={tables.map((t) => t.tableNumber)}
          onAdd={handleAddTable}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onCancel={() => handleCancelReservation(selectedReservation.id)}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}
