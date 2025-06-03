// src/lib/supabase/tables.ts
import { supabase } from '@/lib/supabaseClient';

export type TableRow = {
  id: string;
  table_number: number;
  capacity: number;
  status: string; // 'available' | 'reserved' | 'occupied' | 'maintenance'
};

/**
 * Fetch all tables.
 */
export async function getAllTables(): Promise<TableRow[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('id, table_number, capacity, status')
    .order('table_number', { ascending: true });
  if (error) throw error;
  return (data || []) as TableRow[];
}

/**
 * Update a table’s status.
 */
export async function updateTableStatus(
  table_number: number,
  newStatus: string
): Promise<void> {
  const { error } = await supabase
    .from('tables')
    .update({ status: newStatus })
    .eq('table_number', table_number);
  if (error) throw error;
}

/**
 * Fetch reservations for a single table on a given date.
 */
export type ReservationRow = {
  id: string;
  customer_name: string;
  reservation_time: string; // 'HH:MM'
  persons: number;
  revenue: number;
  status: string; // 'pending' | 'confirmed' | 'cancelled'
};

export async function getReservationsForTableOnDate(
  table_number: number,
  date: string
): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, customer_name, reservation_time, persons, revenue, status')
    .eq('reservation_date', date)
    .eq('table_number', table_number)
    .order('reservation_time', { ascending: true });
  if (error) throw error;
  return (data || []) as ReservationRow[];
}


// import { supabase } from '@/lib/supabaseClient';

// export type ReservationSummary = {
//   id: string;
//   time: string;
//   customer_name: string;
//   customer_email: string;
// };

// export type TableWithReservations = {
//   id: string;
//   tableNumber: number;
//   status: string;
//   seats: number;
//   reservations: ReservationSummary[];
// };

// type RawReservation = {
//   id: string;
//   reservation_time: string;
//   customers: { name?: string; email?: string } | null;
// };

// type RawTable = {
//   id: string;
//   table_number: number;
//   status: string | null;
//   seats: number;
//   reservations: RawReservation[] | null;
// };

// // ✅ Get all tables and their linked reservations
// export const getTablesWithReservations = async (): Promise<TableWithReservations[]> => {
//   const { data, error } = await supabase
//     .from('tables')
//     .select(`
//       id,
//       table_number,
//       status,
//       seats,
//       reservations (
//         id,
//         reservation_time,
//         customers (
//           name,
//           email
//         )
//       )
//     `);

//   if (error) throw new Error(error.message);

//   return (data as RawTable[]).map((table): TableWithReservations => ({
//     id: table.id,
//     tableNumber: table.table_number,
//     status: table.status ?? 'unknown',
//     seats: table.seats,
//     reservations: (table.reservations ?? []).map((res): ReservationSummary => ({
//       id: res.id,
//       time: res.reservation_time,
//       customer_name: res.customers?.name ?? 'Unknown',
//       customer_email: res.customers?.email ?? 'unknown@email.com',
//     })),
//   }));
// };

// // ✅ Add a new table
// export const addTable = async (tableNumber: number, seats: number): Promise<void> => {
//   const { error } = await supabase
//     .from('tables')
//     .insert([{ table_number: tableNumber, seats, status: 'available' }]);

//   if (error) throw new Error(error.message);
// };

// // ✅ Cancel a reservation
// export const cancelReservationById = async (id: string): Promise<void> => {
//   const { error } = await supabase
//     .from('reservations')
//     .update({ status: 'cancelled' })
//     .eq('id', id);

//   if (error) throw new Error(error.message);
// };

// // ADD at bottom of lib/supabase/tables.ts
// export async function updateReservation(
//   id: string,
//   values: { table_id?: string; price?: number }
// ) {
//   const { data, error } = await supabase
//     .from('reservations')
//     .update(values)
//     .eq('id', id)
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

