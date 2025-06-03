// src/lib/supabase/calendar.ts
import { supabase } from '@/lib/supabaseClient';

//
// ─── TYPES ─────────────────────────────────────────────────────────────────────
//

export type ReservationRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  reservation_date: string; // 'YYYY-MM-DD'
  reservation_time: string; // 'HH:MM:SS' or 'HH:MM'
  persons: number;
  revenue: number;
  table_number: number;
  status: string; // 'pending' | 'confirmed' | 'cancelled'
};

export type TableRow = {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
};

//
// ─── FETCH / UPDATE HELPERS ─────────────────────────────────────────────────────
//

/**
 * Fetch all reservations for a given date (YYYY-MM-DD),
 * ordered by reservation_time ascending.
 */
export async function getReservationsByDate(date: string): Promise<ReservationRow[]> {
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
 * Fetch all reservations between `startDate` and `endDate` (inclusive),
 * ordered by date + time. Useful for week‐view.
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
 * Cancel a reservation by setting status = 'cancelled'
 */
export async function cancelReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);
  if (error) throw error;
}

/**
 * Approve a reservation by setting status = 'confirmed'
 */
export async function approveReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'confirmed' })
    .eq('id', id);
  if (error) throw error;
}

/**
 * Update reservation fields (e.g., table_number and/or revenue)
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
 * Fetch all tables (to use for filtering or reassigning)
 */
export async function getAllTables(): Promise<TableRow[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('id, table_number, capacity, status')
    .order('table_number', { ascending: true });
  if (error) throw error;
  return (data || []) as TableRow[];
}
