// src/app/dashboard/page.tsx
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import DashboardClient, { DashboardProps } from '@/app/dashboard/dashboard-client';

// Initialize Supabase for server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getDashboardData(): Promise<DashboardProps> {
  const TODAY = new Date().toISOString().slice(0, 10);

  // 1) Total Reservations (this month, confirmed)
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  )
    .toISOString()
    .slice(0, 10);

  const { count: totalReservations, error: errRes } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', monthStart)
    .lte('reservation_date', monthEnd)
    .eq('status', 'confirmed');
  if (errRes) throw errRes;

  // 2) Total Revenue (this month)
  const { data: revRows, error: errRev } = await supabase
    .from('reservations')
    .select('revenue')
    .gte('reservation_date', monthStart)
    .lte('reservation_date', monthEnd)
    .eq('status', 'confirmed');
  if (errRev) throw errRev;
  const totalRevenue = (revRows ?? []).reduce(
    (sum, r: { revenue: number }) => sum + (r.revenue || 0),
    0
  );

  // 3) Occupancy Rate (today)
  const { data: occRows, error: errOcc } = await supabase
    .from('reservations')
    .select('table_number')
    .eq('reservation_date', TODAY)
    .eq('status', 'confirmed');
  if (errOcc) throw errOcc;
  const uniqueTableNumbers = new Set(
    (occRows ?? []).map((row: { table_number: number }) => row.table_number)
  );
  const occupiedCount = uniqueTableNumbers.size;

  const { count: totalTables, error: errTbl } = await supabase
    .from('tables')
    .select('id', { count: 'exact', head: true });
  if (errTbl) throw errTbl;
  const occupancyRate = totalTables
    ? Math.round((occupiedCount / totalTables) * 100)
    : 0;

  // 4) Table status counts
  const { data: tableData, error: errTableStatus } = await supabase
    .from('tables')
    .select('status');
  if (errTableStatus) throw errTableStatus;
  const tableStatus: DashboardProps['tableStatus'] = {
    available: 0,
    reserved: 0,
    occupied: 0,
    maintenance: 0,
  };
  (tableData ?? []).forEach((row: { status: string }) => {
    const key = row.status as keyof DashboardProps['tableStatus'];
    if (tableStatus[key] !== undefined) tableStatus[key] += 1;
  });

  // 5) Weekly revenue (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const startDate = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: weekRows, error: errWeek } = await supabase
    .from('reservations')
    .select('reservation_date, revenue')
    .gte('reservation_date', startDate)
    .lte('reservation_date', TODAY)
    .eq('status', 'confirmed');
  if (errWeek) throw errWeek;

  const revenueMap: Record<string, number> = {};
  (weekRows ?? []).forEach((r: { reservation_date: string; revenue: number }) => {
    revenueMap[r.reservation_date] = (revenueMap[r.reservation_date] || 0) + r.revenue;
  });
  const weeklyRevenue: Array<{ date: string; revenue: number }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    weeklyRevenue.push({
      date: dateStr,
      revenue: revenueMap[dateStr] || 0,
    });
  }
  weeklyRevenue.reverse();

  // 6) Recent customers (last 5 signed up)
  const { data: recCust, error: errCust } = await supabase
    .from('customers')
    .select('full_name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (errCust) throw errCust;
  const recentCustomers = (recCust || []) as Customer[];

  // 7) Next 5 reservations (today or later)
  const { data: nextRows, error: errNext } = await supabase
    .from('reservations')
    .select('id, customer_name, reservation_date, reservation_time, table_number')
    .eq('status', 'confirmed')
    .gte('reservation_date', TODAY)
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true })
    .limit(5);
  if (errNext) throw errNext;
  const nextReservations = (nextRows || []) as Array<{
    id: string;
    customer_name: string;
    reservation_date: string;
    reservation_time: string;
    table_number: number;
  }>;

  return {
    stats: {
      totalReservations: totalReservations || 0,
      totalRevenue,
      occupancyRate,
    },
    tableStatus,
    weeklyRevenue,
    recentCustomers,
    nextReservations,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient {...data} />;
}


// // src/app/dashboard/page.server.tsx
// import React from 'react';
// import { createClient } from '@supabase/supabase-js';
// import DashboardClient from './dashboard-client'; // import the client component from page.tsx

// type DashboardStats = {
//   totalReservations: number;
//   totalRevenue: number;
//   occupancyRate: number;
// };

// type TableStatusCounts = {
//   available: number;
//   reserved: number;
//   occupied: number;
//   maintenance: number;
// };

// type Customer = {
//   full_name: string;
//   email: string;
//   created_at: string;
// };

// type DashboardProps = {
//   stats: DashboardStats;
//   tableStatus: TableStatusCounts;
//   weeklyRevenue: Array<{ date: string; revenue: number }>;
//   recentCustomers: Customer[];
//   nextReservations: Array<{
//     id: string;
//     customer_name: string;
//     reservation_date: string;
//     reservation_time: string;
//   }>;
// };

// // Initialize Supabase (server-side)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// async function getDashboardData(): Promise<DashboardProps> {
//   const TODAY = new Date().toISOString().slice(0, 10);

//   // 1) Total Reservations (this month, confirmed)
//   const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//     .toISOString()
//     .slice(0, 10);
//   const monthEnd = new Date(
//     new Date().getFullYear(),
//     new Date().getMonth() + 1,
//     0
//   )
//     .toISOString()
//     .slice(0, 10);

//   const { count: totalReservations, error: errRes } = await supabase
//     .from('reservations')
//     .select('id', { count: 'exact', head: true })
//     .gte('reservation_date', monthStart)
//     .lte('reservation_date', monthEnd)
//     .eq('status', 'confirmed');
//   if (errRes) throw errRes;

//   // 2) Total Revenue (this month)
//   const { data: revRows, error: errRev } = await supabase
//     .from('reservations')
//     .select('revenue')
//     .gte('reservation_date', monthStart)
//     .lte('reservation_date', monthEnd)
//     .eq('status', 'confirmed');
//   if (errRev) throw errRev;
//   const totalRevenue = (revRows ?? []).reduce(
//     (sum, r: { revenue: number }) => sum + (r.revenue || 0),
//     0
//   );

//   // 3) Occupancy Rate (today)
//   const { data: occRows, error: errOcc } = await supabase
//     .from('reservations')
//     .select('table_number')
//     .eq('reservation_date', TODAY)
//     .eq('status', 'confirmed');
//   if (errOcc) throw errOcc;
//   const uniqueTableNumbers = new Set(
//     (occRows ?? []).map((row: { table_number: number }) => row.table_number)
//   );
//   const occupiedCount = uniqueTableNumbers.size;

//   const { count: totalTables, error: errTbl } = await supabase
//     .from('tables')
//     .select('id', { count: 'exact', head: true });
//   if (errTbl) throw errTbl;
//   const occupancyRate = totalTables
//     ? Math.round((occupiedCount / totalTables) * 100)
//     : 0;

//   // 4) Table status counts
//   const { data: tableData, error: errTableStatus } = await supabase
//     .from('tables')
//     .select('status');
//   if (errTableStatus) throw errTableStatus;
//   const tableStatus: TableStatusCounts = {
//     available: 0,
//     reserved: 0,
//     occupied: 0,
//     maintenance: 0,
//   };
//   (tableData ?? []).forEach((row: { status: string }) => {
//     const key = row.status as keyof TableStatusCounts;
//     if (tableStatus[key] !== undefined) tableStatus[key] += 1;
//   });

//   // 5) Weekly revenue (last 7 days)
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
//   const startDate = sevenDaysAgo.toISOString().slice(0, 10);

//   const { data: weekRows, error: errWeek } = await supabase
//     .from('reservations')
//     .select('reservation_date, revenue')
//     .gte('reservation_date', startDate)
//     .lte('reservation_date', TODAY)
//     .eq('status', 'confirmed');
//   if (errWeek) throw errWeek;

//   const revenueMap: Record<string, number> = {};
//   (weekRows ?? []).forEach((r: { reservation_date: string; revenue: number }) => {
//     revenueMap[r.reservation_date] = (revenueMap[r.reservation_date] || 0) + r.revenue;
//   });
//   const weeklyRevenue: Array<{ date: string; revenue: number }> = [];
//   for (let i = 0; i < 7; i++) {
//     const d = new Date();
//     d.setDate(d.getDate() - i);
//     const dateStr = d.toISOString().slice(0, 10);
//     weeklyRevenue.push({
//       date: dateStr,
//       revenue: revenueMap[dateStr] || 0,
//     });
//   }
//   weeklyRevenue.reverse();

//   // 6) Recent customers (last 5 signed up)
//   const { data: recCust, error: errCust } = await supabase
//     .from('customers')
//     .select('full_name, email, created_at')
//     .order('created_at', { ascending: false })
//     .limit(5);
//   if (errCust) throw errCust;
//   const recentCustomers = (recCust || []) as Customer[];

//   // 7) Next 5 reservations (today or later)
//   const { data: nextRows, error: errNext } = await supabase
//     .from('reservations')
//     .select('id, customer_name, reservation_date, reservation_time')
//     .eq('status', 'confirmed')
//     .gte('reservation_date', TODAY)
//     .order('reservation_date', { ascending: true })
//     .order('reservation_time', { ascending: true })
//     .limit(5);
//   if (errNext) throw errNext;
//   const nextReservations = (nextRows || []) as Array<{
//     id: string;
//     customer_name: string;
//     reservation_date: string;
//     reservation_time: string;
//   }>;

//   return {
//     stats: {
//       totalReservations: totalReservations || 0,
//       totalRevenue,
//       occupancyRate,
//     },
//     tableStatus,
//     weeklyRevenue,
//     recentCustomers,
//     nextReservations,
//   };
// }

// export default async function DashboardPageWrapper() {
//   const data = await getDashboardData();
//   return <DashboardClient {...data} />;
// }
