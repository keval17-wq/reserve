// src/lib/supabase/dashboard.ts
// ─────────────────────────────────────────────
// 🔹 File: lib/supabase/dashboard.ts
// 🔹 Purpose: Fetch Dashboard Metrics from Supabase (Schema V2–compliant)
// 🔹 Created: April 30, 2025 (updated June 2025)
// 🔹 Author: OpenAI Assistant (based on Keval Gandhi’s original)
// ─────────────────────────────────────────────

import { supabase } from '@/lib/supabaseClient';

//
// ─── TYPES ─────────────────────────────────────────────────────────────────────
//

export type DashboardStats = {
  reservations_today: number;
  revenue_today: number;
  total_tables: number;
  occupied_tables_today: number;
};

export type MonthlyStats = {
  reservations_this_month: number;
  revenue_this_month: number;
};

export type TableStatusCounts = {
  available: number;
  reserved: number;
  occupied: number;
  maintenance: number;
};

export type UpcomingReservation = {
  id: string;
  customer_name: string;
  reservation_date: string;
  reservation_time: string;
  table_number: number;
  revenue: number;
};

export type DailyRevenue = {
  date: string; // 'YYYY-MM-DD'
  revenue: number;
};

export type RecentCustomer = {
  full_name: string;
  email: string;
  created_at: string;
};

//
// ─── FUNCTIONS ─────────────────────────────────────────────────────────────────
//

/**
 * Returns four numbers for a given date (YYYY-MM-DD):
 * 1) reservations_today: count of confirmed bookings on that date
 * 2) revenue_today: sum of revenue of those confirmed bookings
 * 3) total_tables: total number of rows in tables
 * 4) occupied_tables_today: distinct count of table_number with confirmed on that date
 */
export async function getDashboardStats(date: string): Promise<DashboardStats> {
  // 1) Count confirmed reservations for today
  const { count: reservations_today, error: countErr1 } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .eq('reservation_date', date)
    .eq('status', 'confirmed');
  if (countErr1) throw countErr1;

  // 2) Sum revenue of those reservations
  const { data: revData, error: revErr } = await supabase
    .from('reservations')
    .select('revenue')
    .eq('reservation_date', date)
    .eq('status', 'confirmed');
  if (revErr) throw revErr;
  const revenue_today = (revData ?? []).reduce(
    (sum: number, row: { revenue: number }) => sum + (row.revenue || 0),
    0
  );

  // 3) Count total tables
  const { count: total_tables, error: countErr2 } = await supabase
    .from('tables')
    .select('id', { count: 'exact', head: true });
  if (countErr2) throw countErr2;

  // 4) Count distinct occupied tables today
  const { data: occupiedTablesData, error: occErr } = await supabase
    .from('reservations')
    .select('table_number')
    .eq('reservation_date', date)
    .eq('status', 'confirmed');
  if (occErr) throw occErr;
  const occupied_tables_today = new Set(
    (occupiedTablesData ?? []).map((row: { table_number: number }) => row.table_number)
  ).size;

  return {
    reservations_today: reservations_today ?? 0,
    revenue_today: revenue_today ?? 0,
    total_tables: total_tables ?? 0,
    occupied_tables_today: occupied_tables_today,
  };
}

/**
 * Returns:
 * 1) reservations_this_month: count of confirmed bookings between monthStart and monthEnd
 * 2) revenue_this_month: sum of revenue of those confirmed bookings
 */
export async function getMonthlyStats(
  monthStart: string, // 'YYYY-MM-DD'
  monthEnd: string    // 'YYYY-MM-DD'
): Promise<MonthlyStats> {
  // Reservations count
  const { count: reservations_this_month, error: countErr } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', monthStart)
    .lte('reservation_date', monthEnd)
    .eq('status', 'confirmed');
  if (countErr) throw countErr;

  // Revenue sum
  const { data: revRows, error: revErr } = await supabase
    .from('reservations')
    .select('revenue')
    .gte('reservation_date', monthStart)
    .lte('reservation_date', monthEnd)
    .eq('status', 'confirmed');
  if (revErr) throw revErr;
  const revenue_this_month = (revRows ?? []).reduce(
    (sum: number, r: { revenue: number }) => sum + (r.revenue || 0),
    0
  );

  return {
    reservations_this_month: reservations_this_month ?? 0,
    revenue_this_month: revenue_this_month,
  };
}

/**
 * Returns counts of tables in each status.
 */
export async function getTableStatusCounts(): Promise<TableStatusCounts> {
  const { data: tableData, error } = await supabase
    .from('tables')
    .select('status');
  if (error) throw error;

  const counts: TableStatusCounts = {
    available: 0,
    reserved: 0,
    occupied: 0,
    maintenance: 0,
  };

  (tableData ?? []).forEach((row: { status: string }) => {
    const key = row.status as keyof TableStatusCounts;
    if (counts[key] !== undefined) {
      counts[key] += 1;
    }
  });

  return counts;
}

/**
 * Returns at most `count` confirmed reservations occurring today or later, ordered by date/time.
 */
export async function getUpcomingReservations(
  count = 5
): Promise<UpcomingReservation[]> {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  const { data, error } = await supabase
    .from('reservations')
    .select(
      'id, customer_name, reservation_date, reservation_time, table_number, revenue'
    )
    .eq('status', 'confirmed')
    .gte('reservation_date', today)
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true })
    .limit(count);

  if (error) throw error;
  return (data || []) as UpcomingReservation[];
}

/**
 * Returns an array of daily revenue objects for the last 7 days (including today),
 * each with { date: 'YYYY-MM-DD', revenue: number }.
 */
export async function getWeeklyRevenue(): Promise<DailyRevenue[]> {
  const todayObj = new Date();
  const today = todayObj.toISOString().slice(0, 10);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(todayObj.getDate() - 6);
  const startDate = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: weekRows, error } = await supabase
    .from('reservations')
    .select('reservation_date, revenue')
    .gte('reservation_date', startDate)
    .lte('reservation_date', today)
    .eq('status', 'confirmed');
  if (error) throw error;

  const revenueMap: Record<string, number> = {};
  (weekRows ?? []).forEach((r: { reservation_date: string; revenue: number }) => {
    revenueMap[r.reservation_date] = (revenueMap[r.reservation_date] || 0) + r.revenue;
  });

  const result: DailyRevenue[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(todayObj.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({ date: dateStr, revenue: revenueMap[dateStr] || 0 });
  }
  return result.reverse();
}

/**
 * Returns the most recent `limit` customers ordered by creation time.
 */
export async function getRecentCustomers(
  limit = 5
): Promise<RecentCustomer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('full_name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as RecentCustomer[];
}



// import { supabase } from '@/lib/supabaseClient'; 

// // 🟦 Get total reservations
// export const getTotalReservations = async (): Promise<number> => {
//   const { count, error } = await supabase
//     .from('reservations')
//     .select('*', { count: 'exact', head: true });

//   if (error) throw new Error(error.message);
//   return count ?? 0;
// };

// // 🟩 Get total revenue
// export const getTotalRevenue = async (): Promise<number> => {
//   const { data, error } = await supabase
//     .from('reservations')
//     .select('price');

//   if (error) throw new Error(error.message);
//   return (data ?? []).reduce((sum, row) => sum + (row.price ?? 0), 0);
// };

// // 🟨 Get occupancy rate
// export const getOccupancyRate = async (): Promise<number> => {
//   const {
//     data: totalTables,
//     error: tableError,
//   } = await supabase.from('tables').select('*');

//   const {
//     data: activeReservations,
//     error: resError,
//   } = await supabase
//     .from('reservations')
//     .select('*')
//     .eq('status', 'occupied');

//   if (tableError) throw new Error(tableError.message);
//   if (resError) throw new Error(resError.message);

//   const total = totalTables?.length ?? 0;
//   const occupied = activeReservations?.length ?? 0;

//   if (total === 0) return 0;
//   return Math.round((occupied / total) * 100);
// };

// // 🟥 Get recent customers
// export const getRecentCustomers = async (): Promise<
//   { name: string; created_at: string }[]
// > => {
//   const { data, error } = await supabase
//     .from('customers')
//     .select('name, created_at')
//     .order('created_at', { ascending: false })
//     .limit(5);

//   if (error) throw new Error(error.message);
//   return data ?? [];
// };
