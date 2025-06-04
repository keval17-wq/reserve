// src/lib/supabase/calendar.ts

import { supabase } from '@/lib/supabaseClient';

//
// ─── TYPES ─────────────────────────────────────────────────────────────────────
//

export type ReservationRow = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  reservation_date: string;   // 'YYYY-MM-DD'
  reservation_time: string;   // 'HH:MM' (or 'HH:MM:SS')
  persons: number;
  revenue: number;
  table_number: number;
  status: string;             // 'pending' | 'confirmed' | 'cancelled'
};

export type TableRow = {
  id: string;
  table_number: number;
  capacity: number;
  status: string;             // 'available' | 'reserved' | 'occupied' | 'maintenance'
};

//
// ─── FETCH / UPDATE HELPERS ─────────────────────────────────────────────────────
//

/**
 * 1) Returns all tables that have at least `capacity >= persons`
 * 2) Excludes any table_number that already has a "confirmed" reservation at exactly 
 *    the given `date`/`time`.
 */
export async function getAvailableTables(
  date: string,     // 'YYYY-MM-DD'
  time: string,     // 'HH:MM'
  persons: number
): Promise<TableRow[]> {
  // 1) Fetch all "confirmed" reservations at that date/time
  const { data: busy, error: busyErr } = await supabase
    .from('reservations')
    .select('table_number')
    .eq('reservation_date', date)
    .eq('reservation_time', time)
    .eq('status', 'confirmed');

  if (busyErr) throw busyErr;

  // 2) Build an array of busy table_numbers
  const busyTableNumbers = (busy || []).map((r: { table_number: number }) => r.table_number);

  // 3) Fetch all tables with capacity >= persons that are NOT in busyTableNumbers
  const { data: available, error: availErr } = await supabase
    .from('tables')
    .select('id, table_number, capacity, status')
    .gte('capacity', persons)                        // at least that many seats
    .neq('status', 'maintenance')                     // skip maintenance
    .not('table_number', 'in', `(${busyTableNumbers.join(',')})`); 
    // The `.not('table_number','in', ...)` syntax excludes busy tables.

  if (availErr) throw availErr;

  return (available || []) as TableRow[];
}

/**
 * Picks a random table ID from the list of available tables.
 * Returns the `id` field (UUID) of one random table, or `null` if none available.
 */
export async function getRandomAvailableTable(
  date: string,
  time: string,
  persons: number
): Promise<string | null> {
  const available = await getAvailableTables(date, time, persons);

  if (!available || available.length === 0) {
    return null;
  }

  // Pick a random index
  const randIdx = Math.floor(Math.random() * available.length);
  return available[randIdx].id;
}

/**
 * Creates a new reservation row in the database.
 * Expects a partial object matching your Schema V2 for reservations.
 */
export async function createReservation(input: {
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  reservation_date: string;   // 'YYYY-MM-DD'
  reservation_time: string;   // 'HH:MM'
  persons: number;
  revenue: number;
  table_number: number;
}): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      customer_email: input.customer_email,
      customer_name:  input.customer_name,
      customer_phone: input.customer_phone ?? null,
      reservation_date: input.reservation_date,
      reservation_time: input.reservation_time,
      persons: input.persons,
      revenue: input.revenue,
      table_number: input.table_number,
      status: 'confirmed',       // default to confirmed; or you can accept 'pending' as needed
    })
    .select('id')
    .single();

  if (error) throw error;
  return data as { id: string };
}

/**
 * Cancel a reservation by setting status = 'cancelled'.
 */
export async function cancelReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Approve a reservation by setting status = 'confirmed'.
 */
export async function approveReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'confirmed' })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Fetch reservations on a single date (for calendar-day view).
 */
export async function getReservationsByDate(
  date: string
): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select(
      'id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, persons, revenue, table_number, status'
    )
    .eq('reservation_date', date)
    .order('reservation_time', { ascending: true });

  if (error) throw error;
  return (data || []) as ReservationRow[];
}

/**
 * Fetch all reservations in a date range (for calendar-week view).
 */
export async function getReservationsByDateRange(
  startDate: string,
  endDate: string
): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select(
      'id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, persons, revenue, table_number, status'
    )
    .gte('reservation_date', startDate)
    .lte('reservation_date', endDate)
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true });

  if (error) throw error;
  return (data || []) as ReservationRow[];
}

/**
 * Update reservation fields (e.g. table_number or revenue).
 */
export async function updateReservation(
  id: string,
  fields: { table_number?: number; revenue?: number }
): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update(fields)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Fetch all tables (for dropdowns, filters, etc.).
 */
export async function getAllTables(): Promise<TableRow[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('id, table_number, capacity, status')
    .order('table_number', { ascending: true });

  if (error) throw error;
  return (data || []) as TableRow[];
}


// // src/lib/supabase/calendar.ts
// import { supabase } from '@/lib/supabaseClient';

// //
// // ─── TYPES ─────────────────────────────────────────────────────────────────────
// //

// export type ReservationRow = {
//   id: string;
//   customer_name: string;
//   customer_email: string;
//   customer_phone: string | null;
//   reservation_date: string; // 'YYYY-MM-DD'
//   reservation_time: string; // 'HH:MM:SS' or 'HH:MM'
//   persons: number;
//   revenue: number;
//   table_number: number;
//   status: string; // 'pending' | 'confirmed' | 'cancelled'
// };

// export type TableRow = {
//   id: string;
//   table_number: number;
//   capacity: number;
//   status: string;
// };

// //
// // ─── FETCH / UPDATE HELPERS ─────────────────────────────────────────────────────
// //

// /**
//  * Fetch all reservations for a given date (YYYY-MM-DD),
//  * ordered by reservation_time ascending.
//  */
// export async function getReservationsByDate(date: string): Promise<ReservationRow[]> {
//   const { data, error } = await supabase
//     .from('reservations')
//     .select(
//       'id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, persons, revenue, table_number, status'
//     )
//     .eq('reservation_date', date)
//     .order('reservation_time', { ascending: true });
//   if (error) throw error;
//   return (data || []) as ReservationRow[];
// }

// /**
//  * Fetch all reservations between `startDate` and `endDate` (inclusive),
//  * ordered by date + time. Useful for week‐view.
//  */
// export async function getReservationsByDateRange(
//   startDate: string,
//   endDate: string
// ): Promise<ReservationRow[]> {
//   const { data, error } = await supabase
//     .from('reservations')
//     .select(
//       'id, customer_name, customer_email, customer_phone, reservation_date, reservation_time, persons, revenue, table_number, status'
//     )
//     .gte('reservation_date', startDate)
//     .lte('reservation_date', endDate)
//     .order('reservation_date', { ascending: true })
//     .order('reservation_time', { ascending: true });
//   if (error) throw error;
//   return (data || []) as ReservationRow[];
// }

// /**
//  * Cancel a reservation by setting status = 'cancelled'
//  */
// export async function cancelReservation(id: string): Promise<void> {
//   const { error } = await supabase
//     .from('reservations')
//     .update({ status: 'cancelled' })
//     .eq('id', id);
//   if (error) throw error;
// }

// /**
//  * Approve a reservation by setting status = 'confirmed'
//  */
// export async function approveReservation(id: string): Promise<void> {
//   const { error } = await supabase
//     .from('reservations')
//     .update({ status: 'confirmed' })
//     .eq('id', id);
//   if (error) throw error;
// }

// /**
//  * Update reservation fields (e.g., table_number and/or revenue)
//  */
// export async function updateReservation(
//   id: string,
//   fields: { table_number?: number; revenue?: number }
// ): Promise<void> {
//   const { error } = await supabase
//     .from('reservations')
//     .update(fields)
//     .eq('id', id);
//   if (error) throw error;
// }

// /**
//  * Fetch all tables (to use for filtering or reassigning)
//  */
// export async function getAllTables(): Promise<TableRow[]> {
//   const { data, error } = await supabase
//     .from('tables')
//     .select('id, table_number, capacity, status')
//     .order('table_number', { ascending: true });
//   if (error) throw error;
//   return (data || []) as TableRow[];
// }
