// src/app/tables/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
//import { format } from 'date-fns';

import {
  getAllTables,
  getReservationsForTableOnDate,
  TableRow,
} from '@/lib/supabase/tables';
import { TableCard } from '@/components/tables/tableCard';
import { TableDetailModal } from '@/components/tables/tableDetailModal';

export default function TablesPage() {
  const todayDefault = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayDefault);
  const [tables, setTables] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [openTable, setOpenTable] = useState<TableRow | null>(null);
  const [nextByTable, setNextByTable] = useState<Record<number, string | undefined>>({});

  // 1) Load all tables
  const loadTables = async () => {
    setLoading(true);
    try {
      const rows = await getAllTables();
      setTables(rows);
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  // 2) Whenever tables OR selectedDate changes, compute next reservation time for each table
  useEffect(() => {
    async function computeNextTimes() {
      const mapping: Record<number, string | undefined> = {};
      await Promise.all(
        tables.map(async (t) => {
          try {
            const resRows = await getReservationsForTableOnDate(t.table_number, selectedDate);
            // find first confirmed reservation
            const confirmed = resRows.find((r) => r.status === 'confirmed');
            mapping[t.table_number] = confirmed
              ? confirmed.reservation_time.slice(0, 5)
              : undefined;
          } catch {
            mapping[t.table_number] = undefined;
          }
        })
      );
      setNextByTable(mapping);
    }

    if (tables.length > 0) {
      computeNextTimes();
    }
  }, [tables, selectedDate]);

  // Filtered tables by status
  const displayedTables = statusFilter
    ? tables.filter((t) => t.status === statusFilter)
    : tables;

  return (
    <div className="bg-white text-black min-h-screen p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Tables</h1>
          <p className="text-sm text-gray-600">
            Click a table to view details or update status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Table Cards */}
      {loading ? (
        <p className="text-gray-500">Loading tables…</p>
      ) : displayedTables.length === 0 ? (
        <p className="text-gray-500">No tables match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedTables.map((t) => (
            <TableCard
              key={t.id}
              table_number={t.table_number}
              capacity={t.capacity}
              status={t.status}
              nextReservationTime={nextByTable[t.table_number]}
              onClick={() => setOpenTable(t)}
            />
          ))}
        </div>
      )}

      {/* Table Detail Modal */}
      {openTable && (
        <TableDetailModal
          table={openTable}
          date={selectedDate}
          onClose={() => setOpenTable(null)}
          onStatusChange={loadTables}
        />
      )}
    </div>
  );
}
