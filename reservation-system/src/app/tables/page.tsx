'use client';

import { useEffect, useState } from 'react';
import { getTablesWithReservations, addTable, cancelReservationById } from '@/lib/supabase/tables';
import { sendEmail } from '@/lib/supabase/email';
import { TableGrid } from '@/components/tables/tableGrid';
import { TableFormModal } from '@/components/tables/tableFormModal';
import type { TableWithReservations } from '@/lib/supabase/tables';

export default function TablesPage() {
  const [tables, setTables] = useState<TableWithReservations[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadTables = async () => {
    try {
      const data = await getTablesWithReservations();
      setTables(data);
    } catch (err) {
      console.error('Error loading tables:', err);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleCancelReservation = async (
    reservationId: string,
    customerEmail: string,
    customerName: string,
    time: string,
    partySize: number
  ) => {
    try {
      await cancelReservationById(reservationId);

      await sendEmail({
        reservationId,
        toEmail: customerEmail,
        customerName,
        reservationDateTime: new Date(time).toLocaleString(),
        partySize,
        type: 'cancel',
      });

      await loadTables();
    } catch (error) {
      console.error('Cancellation failed:', error);
    }
  };

  const handleAddTable = async (tableNumber: number, seats: number) => {
    try {
      await addTable(tableNumber, seats);
      setShowModal(false);
      await loadTables();
    } catch (error) {
      console.error('Add table failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tables</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Table
        </button>
      </div>

      <TableGrid tables={tables} onCancel={handleCancelReservation} />

      {showModal && (
        <TableFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTable}
        />
      )}
    </div>
  );
}
