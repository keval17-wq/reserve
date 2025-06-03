// src/app/analytics/page.tsx

import React from 'react';
import { createClient } from '@supabase/supabase-js';
import AnalyticsClient, { AnalyticsProps } from '@/app/analytics/analytics-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all data for analytics:
 * 1) Weekly revenue (last 7 days)
 * 2) Monthly revenue for last 6 months
 * 3) Table status counts
 * 4) Total customers count
 * 5) Total reservations count (confirmed) this month
 */
async function getAnalyticsData(): Promise<AnalyticsProps> {
  const TODAY = new Date();
  const todayStr = TODAY.toISOString().slice(0, 10); // 'YYYY-MM-DD'

  // 1) Weekly revenue (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(TODAY.getDate() - 6);
  const weekStart = sevenDaysAgo.toISOString().slice(0, 10);
  const { data: weekRows, error: errWeek } = await supabase
    .from('reservations')
    .select('reservation_date, revenue')
    .gte('reservation_date', weekStart)
    .lte('reservation_date', todayStr)
    .eq('status', 'confirmed');
  if (errWeek) throw errWeek;
  // Map date → sum
  const revenueMap: Record<string, number> = {};
  (weekRows ?? []).forEach((r: { reservation_date: string; revenue: number }) => {
    revenueMap[r.reservation_date] = (revenueMap[r.reservation_date] || 0) + r.revenue;
  });
  const weeklyRevenue: Array<{ date: string; revenue: number }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(TODAY.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    weeklyRevenue.push({ date: dateStr, revenue: revenueMap[dateStr] || 0 });
  }
  weeklyRevenue.reverse();

  // 2) Monthly revenue for last 6 months
  const monthlyRevenue: Array<{ month: string; revenue: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const mDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1);
    const month = mDate.getMonth(); // 0–11
    const year = mDate.getFullYear();
    const monthStart = new Date(year, month, 1).toISOString().slice(0, 10);
    const monthEnd = new Date(year, month + 1, 0).toISOString().slice(0, 10);
    const { data: mRows, error: errM } = await supabase
      .from('reservations')
      .select('revenue')
      .gte('reservation_date', monthStart)
      .lte('reservation_date', monthEnd)
      .eq('status', 'confirmed');
    if (errM) throw errM;
    const sumRevenue = (mRows || []).reduce(
      (sum: number, r: { revenue: number }) => sum + (r.revenue || 0),
      0
    );
    // Label as 'MMM YYYY'
    const label = mDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    monthlyRevenue.push({ month: label, revenue: sumRevenue });
  }

  // 3) Table status counts
  const { data: tableData, error: errTable } = await supabase
    .from('tables')
    .select('status');
  if (errTable) throw errTable;
  const tableStatusCounts: Record<string, number> = {
    available: 0,
    reserved: 0,
    occupied: 0,
    maintenance: 0,
  };
  (tableData || []).forEach((row: { status: string }) => {
    const key = row.status;
    if (tableStatusCounts[key] !== undefined) {
      tableStatusCounts[key]++;
    }
  });

  // 4) Total customers count
  const { count: totalCustomers, error: errCustCount } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true });
  if (errCustCount) throw errCustCount;

  // 5) Total confirmed reservations this month
  const monthStartDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEndDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
  const { count: totalReservations, error: errResCount } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', monthStartDate)
    .lte('reservation_date', monthEndDate)
    .eq('status', 'confirmed');
  if (errResCount) throw errResCount;

  return {
    weeklyRevenue,
    monthlyRevenue,
    tableStatusCounts,
    totalCustomers: totalCustomers || 0,
    totalReservations: totalReservations || 0,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  return <AnalyticsClient {...data} />;
}
