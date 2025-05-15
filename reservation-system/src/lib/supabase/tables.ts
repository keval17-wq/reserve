import { supabase } from '@/lib/supabaseClient';

type ReservationSummary = {
  id: string;
  time: string;
  customer_name: string;
};

type TableWithReservations = {
  id: string;
  tableNumber: number;
  status: string;
  seats: number;
  reservations: ReservationSummary[];
};

// ✅ Get all tables and their reservations
export const getTablesWithReservations = async (): Promise<TableWithReservations[]> => {
  const { data: tables, error } = await supabase
    .from('tables')
    .select(`
      id,
      table_number,
      status,
      seats,
      reservations (
        id,
        reservation_time,
        customers ( name )
      )
    `);

  if (error) throw new Error(error.message);

  return (tables ?? []).map((table: any): TableWithReservations => ({
    id: table.id,
    tableNumber: table.table_number,
    status: table.status ?? 'unknown',
    seats: table.seats,
    reservations: (table.reservations ?? []).map((res: any): ReservationSummary => ({
      id: res.id,
      customer_name: res.customers?.name ?? 'Unknown',
      time: res.reservation_time,
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

// ✅ Cancel a reservation by ID
export const cancelReservationById = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) throw new Error(error.message);
};
