import { supabase } from '@/lib/supabaseClient';

export type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

type ReservationPayload = {
  customer_id: string;
  table_id: string;
  reservation_time: string;
  price: number;
  special_instructions?: string;
};

export const createReservation = async (
  payload: ReservationPayload
): Promise<{ id: string }> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([payload])
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
};

export const getAvailableTables = async (
  date: string,
  time: string,
  partySize: number
) => {
  const reservationStart = new Date(`${date}T${time}`);
  const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);

  const { data: allTables, error: tablesError } = await supabase
    .from('tables')
    .select('*')
    .gte('seats', partySize);

  if (tablesError) throw new Error(tablesError.message);

  const { data: reservations, error: reservationsError } = await supabase
    .from('reservations')
    .select('table_id, reservation_time');

  if (reservationsError) throw new Error(reservationsError.message);

  const unavailableIds = reservations
    .filter((res) => {
      const resStart = new Date(res.reservation_time);
      const resEnd = new Date(resStart.getTime() + 2 * 60 * 60 * 1000);
      return resStart < reservationEnd && resEnd > reservationStart;
    })
    .map((res) => res.table_id);

  return allTables.filter((t) => !unavailableIds.includes(t.id));
};

export const getReservationsByMonth = async (
  year: number,
  month: number
): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, customer_name, reservation_time, table_number');

  if (error) throw new Error(error.message);
  return (data ?? []) as Reservation[];
};


// // ✅ lib/supabase/calendar.ts
// import { supabase } from '@/lib/supabaseClient';

// export type Reservation = {
//   id: string;
//   customer_name: string;
//   reservation_time: string;
//   table_number: number;
// };

// // Type-safe payload for reservation
// type ReservationPayload = {
//   customer_id: string;
//   table_id: string;
//   reservation_time: string;
//   price: number;
//   special_instructions?: string;
// };

// // ✅ Create a new reservation and return its ID
// export const createReservation = async (
//   payload: ReservationPayload
// ): Promise<{ id: string }> => {
//   const { data, error } = await supabase
//     .from('reservations')
//     .insert([payload])
//     .select('id')
//     .single();

//   if (error) throw new Error(error.message);
//   return { id: data.id };
// };

// // ✅ Get available tables for a given time slot and party size
// export const getAvailableTables = async (
//   date: string,
//   time: string,
//   partySize: number
// ) => {
//   const reservationStart = new Date(`${date}T${time}`);
//   const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);

//   const { data: allTables, error: tablesError } = await supabase
//     .from('tables')
//     .select('*')
//     .gte('seats', partySize);

//   if (tablesError) throw new Error(tablesError.message);

//   const { data: reservations, error: reservationsError } = await supabase
//     .from('reservations')
//     .select('table_id, reservation_time');

//   if (reservationsError) throw new Error(reservationsError.message);

//   const unavailableIds = reservations
//     .filter((res) => {
//       const resStart = new Date(res.reservation_time);
//       const resEnd = new Date(resStart.getTime() + 2 * 60 * 60 * 1000);
//       return resStart < reservationEnd && resEnd > reservationStart;
//     })
//     .map((res) => res.table_id);

//   return allTables.filter((t) => !unavailableIds.includes(t.id));
// };

// // ✅ Get all reservations for a specific month (typed result)
// export const getReservationsByMonth = async (
//   year: number,
//   month: number
// ): Promise<Reservation[]> => {
//   const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
//   const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();

//   const { data, error } = await supabase
//     .from('reservations')
//     .select('id, customer_name, reservation_time, table_number');

//   if (error) throw new Error(error.message);
//   return (data ?? []) as Reservation[];
// };


// import { supabase } from '@/lib/supabaseClient';

// // Type-safe payload for reservation
// type ReservationPayload = {
//   customer_id: string;
//   table_id: string;
//   reservation_time: string;
//   price: number;
//   special_instructions?: string;
// };

// // ✅ Create a new reservation and return its ID
// export const createReservation = async (
//   payload: ReservationPayload
// ): Promise<{ id: string }> => {
//   const { data, error } = await supabase
//     .from('reservations')
//     .insert([payload])
//     .select('id')
//     .single();

//   if (error) throw new Error(error.message);
//   return { id: data.id };
// };

// // ✅ Get available tables for a given time slot and party size
// export const getAvailableTables = async (
//   date: string,
//   time: string,
//   partySize: number
// ) => {
//   const reservationStart = new Date(`${date}T${time}`);
//   const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);

//   const { data: allTables, error: tablesError } = await supabase
//     .from('tables')
//     .select('*')
//     .gte('seats', partySize);

//   if (tablesError) throw new Error(tablesError.message);

//   const { data: reservations, error: reservationsError } = await supabase
//     .from('reservations')
//     .select('table_id, reservation_time');

//   if (reservationsError) throw new Error(reservationsError.message);

//   const unavailableIds = reservations
//     .filter((res) => {
//       const resStart = new Date(res.reservation_time);
//       const resEnd = new Date(resStart.getTime() + 2 * 60 * 60 * 1000);
//       return resStart < reservationEnd && resEnd > reservationStart;
//     })
//     .map((res) => res.table_id);

//   return allTables.filter((t) => !unavailableIds.includes(t.id));
// };

// // ✅ Get all reservations for a specific month (UTC safe)
// export const getReservationsByMonth = async (year: number, month: number) => {
//   const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
//   const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();

//   const { data, error } = await supabase
//     .from('reservations')
//     .select('*')
//     .gte('reservation_time', startDate)
//     .lte('reservation_time', endDate);

//   if (error) throw new Error(error.message);
//   return data ?? [];
// };
