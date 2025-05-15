import { supabase } from '@/lib/supabaseClient';

export type RevenueTrend = {
  date: string;
  revenue: number;
};

export const getAnalyticsOverview = async () => {
  const [resData, revenueData, customerData, tableData] = await Promise.all([
    supabase.from('reservations').select('*'),
    supabase.from('reservations').select('price'),
    supabase.from('customers').select('*'),
    supabase.from('tables').select('*'),
  ]);

  const reservations = resData.data ?? [];
  const totalRevenue = (revenueData.data ?? []).reduce((acc, row) => acc + (row.price ?? 0), 0);
  const totalCustomers = customerData.data?.length ?? 0;
  const totalTables = tableData.data?.length ?? 0;
  const occupied = reservations.filter((r) => r.status === 'occupied').length;

  return {
    totalRevenue,
    totalReservations: reservations.length,
    totalCustomers,
    occupancyRate: totalTables > 0 ? Math.round((occupied / totalTables) * 100) : 0,
    revenueDelta: 12,
    reservationsDelta: -3,
    customersDelta: 5,
    occupancyDelta: 2,
  };
};

export const getRevenueTrends = async (): Promise<RevenueTrend[]> => {
  const { data, error } = await supabase
    .from('reservations')
    .select('price, reservation_time')
    .order('reservation_time', { ascending: true });

  if (error) throw new Error(error.message);

  const trends: Record<string, number> = {};
  (data ?? []).forEach((res) => {
    const day = new Date(res.reservation_time).toLocaleDateString('en-US', {
      weekday: 'short',
    });
    trends[day] = (trends[day] ?? 0) + (res.price ?? 0);
  });

  return Object.entries(trends).map(([date, revenue]) => ({ date, revenue }));
};
