import { supabase } from '@/lib/supabaseClient';

export type ReservationSummary = {
  id: string;
  time: string;
  customer_name: string;
  customer_email: string;
};

export type TableWithReservations = {
  id: string;
  tableNumber: number;
  status: string;
  seats: number;
  reservations: ReservationSummary[];
};

type RawReservation = {
  id: string;
  reservation_time: string;
  customers: { name?: string; email?: string } | null;
};

type RawTable = {
  id: string;
  table_number: number;
  status: string | null;
  seats: number;
  reservations: RawReservation[] | null;
};

// ✅ Get all tables and their linked reservations
export const getTablesWithReservations = async (): Promise<TableWithReservations[]> => {
  const { data, error } = await supabase
    .from('tables')
    .select(`
      id,
      table_number,
      status,
      seats,
      reservations (
        id,
        reservation_time,
        customers (
          name,
          email
        )
      )
    `);

  if (error) throw new Error(error.message);

  return (data as RawTable[]).map((table): TableWithReservations => ({
    id: table.id,
    tableNumber: table.table_number,
    status: table.status ?? 'unknown',
    seats: table.seats,
    reservations: (table.reservations ?? []).map((res): ReservationSummary => ({
      id: res.id,
      time: res.reservation_time,
      customer_name: res.customers?.name ?? 'Unknown',
      customer_email: res.customers?.email ?? 'unknown@email.com',
    })),
  }));
};

// ✅ Add a new table
export const addTable = async (tableNumber: number, seats: number): Promise<void> => {
  const { error } = await supabase
    .from('tables')
    .insert([{ table_number: tableNumber, seats, status: 'available' }]);

  if (error) throw new Error(error.message);
};

// ✅ Cancel a reservation
export const cancelReservationById = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw new Error(error.message);
};
