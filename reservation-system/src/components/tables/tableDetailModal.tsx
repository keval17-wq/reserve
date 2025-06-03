// src/components/tables/TableDetailModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

import {
  getReservationsForTableOnDate,
  updateTableStatus,
  TableRow,
} from '@/lib/supabase/tables';

export type ReservationRow = {
  id: string;
  customer_name: string;
  reservation_time: string; // 'HH:MM'
  persons: number;
  revenue: number;
  status: string; // 'pending' | 'confirmed' | 'cancelled'
};

type Props = {
  table: TableRow;
  date: string; // 'YYYY-MM-DD'
  onClose: () => void;
  onStatusChange: () => void; // parent should reload table list
};

export const TableDetailModal: React.FC<Props> = ({
  table,
  date,
  onClose,
  onStatusChange,
}) => {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newStatus, setNewStatus] = useState<string>(table.status);

  // Fetch this table’s reservations on the given date
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const rows = await getReservationsForTableOnDate(
          table.table_number,
          date
        );
        setReservations(rows);
      } catch (err) {
        console.error('Error fetching table reservations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [table.table_number, date]);

  const handleStatusUpdate = async () => {
    if (newStatus === table.status) {
      onClose();
      return;
    }
    try {
      await updateTableStatus(table.table_number, newStatus);
      onStatusChange();
      onClose();
    } catch (err) {
      console.error('Error updating table status:', err);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white text-black rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-2xl font-semibold text-gray-800">
            Table {table.table_number} Details
          </h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Change */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Update Status
            </button>
          </div>

          {/* Reservations List */}
          <div>
            <h4 className="text-xl font-semibold mb-2">
              Reservations on {format(new Date(date), 'MMMM do, yyyy')}
            </h4>
            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : reservations.length === 0 ? (
              <p className="text-gray-500">No reservations for this table.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Time
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Persons
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Revenue
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {format(
                            new Date(r.reservation_time.length === 5
                              ? date + 'T' + r.reservation_time
                              : date + 'T' + r.reservation_time.slice(0, 5)
                            ),
                            'HH:mm'
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {r.customer_name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {r.persons}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          ${r.revenue.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {r.status === 'confirmed' ? (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                              Confirmed
                            </span>
                          ) : r.status === 'pending' ? (
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
