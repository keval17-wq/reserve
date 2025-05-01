// ─────────────────────────────────────────────
// 🔹 File: lib/supabase/dashboard.ts
// 🔹 Purpose: Fetch Dashboard Metrics from Supabase
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import { supabase } from '@/lib/supabaseClient'; 

// 🟦 Get total reservations
export const getTotalReservations = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
};

// 🟩 Get total revenue
export const getTotalRevenue = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('price');

  if (error) throw new Error(error.message);
  return (data ?? []).reduce((sum, row) => sum + (row.price ?? 0), 0);
};

// 🟨 Get occupancy rate
export const getOccupancyRate = async (): Promise<number> => {
  const {
    data: totalTables,
    error: tableError,
  } = await supabase.from('tables').select('*');

  const {
    data: activeReservations,
    error: resError,
  } = await supabase
    .from('reservations')
    .select('*')
    .eq('status', 'occupied');

  if (tableError) throw new Error(tableError.message);
  if (resError) throw new Error(resError.message);

  const total = totalTables?.length ?? 0;
  const occupied = activeReservations?.length ?? 0;

  if (total === 0) return 0;
  return Math.round((occupied / total) * 100);
};

// 🟥 Get recent customers
export const getRecentCustomers = async (): Promise<
  { name: string; created_at: string }[]
> => {
  const { data, error } = await supabase
    .from('customers')
    .select('name, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);
  return data ?? [];
};
