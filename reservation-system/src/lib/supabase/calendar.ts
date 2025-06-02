// src/lib/supabase/calendar.ts

import { supabase } from '@/lib/supabaseClient';
import { sendEmail } from './email';

export type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
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

// ─────────────────────────────────────────────────
// 1️⃣ Create a reservation (identical to before)
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
// 2️⃣ Get all tables that can seat this party & aren’t booked
// ─────────────────────────────────────────────────
export const getAvailableTables = async (
  date: string,
  time: string,
  partySize: number
) => {
  const start = new Date(`${date}T${time}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const { data: allTables, error: tblErr } = await supabase
    .from('tables')
    .select('id, table_number, seats, status')

    .gte('seats', partySize);
  if (tblErr) throw new Error(tblErr.message);

  const { data: resvs, error: resErr } = await supabase
    .from('reservations')
    .select('table_id, reservation_time');
  if (resErr) throw new Error(resErr.message);

  const busy = (resvs ?? [])
    .filter(r => {
      const s = new Date(r.reservation_time);
      const e = new Date(s.getTime() + 2 * 60 * 60 * 1000);
      return s < end && e > start;
    })
    .map(r => r.table_id);

  return (allTables ?? []).filter(t => !busy.includes(t.id));
};

// ─────────────────────────────────────────────────
// 3️⃣ Auto-assign a random available table
// ─────────────────────────────────────────────────
export const getRandomAvailableTable = async (
  date: string,
  time: string,
  partySize: number
): Promise<string | null> => {
  const candidates = await getAvailableTables(date, time, partySize);
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return pick.id;
};

// ─────────────────────────────────────────────────
// 4️⃣ Day-view: all reservations on one date
// ─────────────────────────────────────────────────
export const getReservationsByDate = async (
  isoDate: string
): Promise<Reservation[]> => {
  const start = new Date(`${isoDate}T00:00:00`);
  const end = new Date(`${isoDate}T23:59:59.999`);

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .gte('reservation_time', start.toISOString())
    .lt('reservation_time', end.toISOString())
    .order('reservation_time', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Reservation[];
};

// ─────────────────────────────────────────────────
// 5️⃣ Week-view: count of reservations Mon–Sun
// ─────────────────────────────────────────────────
export const getWeekCounts = async (
  mondayIsoDate: string
): Promise<Record<string, number>> => {
  const start = new Date(mondayIsoDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const { data, error } = await supabase
    .from('reservations')
    .select('reservation_time')
    .gte('reservation_time', start.toISOString())
    .lt('reservation_time', end.toISOString());
  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
  };
  (data ?? []).forEach(r => {
    const day = new Date(r.reservation_time)
      .toLocaleDateString('en-US', { weekday: 'short' });
    counts[day] += 1;
  });
  return counts;
};

export const getReservationsByMonth = async (
  year: number,
  month: number
): Promise<Reservation[]> => {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const { data, error } = await supabase
    .from('reservations_extended')
    .select('*')
    .gte('reservation_time', start.toISOString())
    .lt('reservation_time', end.toISOString())
    .order('reservation_time', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Reservation[];
};


// Add this new method at the bottom of calendar.ts
export const approveReservation = async (
  reservationId: string,
  customerEmail: string,
  customerName: string,
  reservationDateTime: string,
  partySize: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('reservations')
    .update({ is_approved: true })
    .eq('id', reservationId);

  if (error) throw new Error(error.message);

  await sendEmail({
    reservationId,
    toEmail: customerEmail,
    customerName,
    reservationDateTime,
    partySize,
    type: 'confirmation',
  });

  return true;
};
