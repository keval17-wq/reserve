// ─────────────────────────────────────────────
// 🔹 File: lib/supabase/calendar.ts
// 🔹 Purpose: Reservation logic for Calendar Page
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import { supabase } from '@/lib/supabaseClient';

// 🗓️ Fetch reservations for an entire month
export const getReservationsByMonth = async (year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      reservation_time,
      table_id,
      tables(table_number),
      customers(name)
    `)
    .gte('reservation_time', startDate)
    .lte('reservation_time', endDate)
    .order('reservation_time', { ascending: true });

  if (error) {
    console.error('Error fetching monthly reservations:', error.message);
    return [];
  }

  const grouped = data.reduce((acc: any, res: any) => {
    const date = new Date(res.reservation_time).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push({
      id: res.id,
      reservation_time: res.reservation_time,
      table_number: res.tables?.table_number,
      customer_name: res.customers?.name ?? 'Unknown',
    });
    return acc;
  }, {});

  return Object.entries(grouped).map(([date, reservations]) => ({
    date,
    reservations,
  }));
};

// 🔍 Get available tables for a given date/time and seat size
export const getAvailableTables = async (date: string, time: string, seats: number) => {
  const fullDateTime = new Date(`${date}T${time}`).toISOString();

  // 1. Get all tables that match seat requirement
  const { data: allTables, error: tableError } = await supabase
    .from('tables')
    .select('*')
    .gte('seats', seats);

  if (tableError) throw new Error(tableError.message);

  // 2. Get reservations already made at that time
  const { data: occupiedRes, error: resError } = await supabase
    .from('reservations')
    .select('table_id')
    .eq('reservation_time', fullDateTime);

  if (resError) throw new Error(resError.message);

  const occupiedIds = occupiedRes.map((r) => r.table_id);
  return allTables.filter((table) => !occupiedIds.includes(table.id));
};

// ❌ Cancel a reservation
export const cancelReservation = async (id: string) => {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

// 🔁 Move reservation to new date/time/table
export const moveReservation = async (id: string, newTime: string, newTableId: string) => {
  const { error } = await supabase
    .from('reservations')
    .update({ reservation_time: newTime, table_id: newTableId })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

// ➕ Create a reservation
export const createReservation = async ({
  customer_id,
  table_id,
  reservation_time,
  price,
  status = 'confirmed',
}: {
  customer_id: string;
  table_id: string;
  reservation_time: string;
  price: number;
  status?: string;
}) => {
  const { error } = await supabase.from('reservations').insert([
    {
      customer_id,
      table_id,
      reservation_time,
      price,
      status,
    },
  ]);

  if (error) throw new Error(error.message);
};
