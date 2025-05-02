'use client';

import React, { useEffect, useState } from 'react';
import { getAnalyticsOverview, getRevenueTrends } from '@/lib/supabase/analytics';
import { OverviewCard } from '@/components/analytics/overviewCard';
import { RevenueLineChart } from '../../components/analytics/revenueLineChart';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, trends] = await Promise.all([
          getAnalyticsOverview(),
          getRevenueTrends(),
        ]);
        setOverview(overviewData);
        setTrendData(trends);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8 bg-white text-black min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-gray-600">Key metrics and revenue trends for your restaurant</p>
      </header>

      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverviewCard title="Total Revenue" value={`$${overview.totalRevenue}`} delta={overview.revenueDelta} />
          <OverviewCard title="Reservations" value={overview.totalReservations} delta={overview.reservationsDelta} />
          <OverviewCard title="Customers" value={overview.totalCustomers} delta={overview.customersDelta} />
          <OverviewCard title="Occupancy Rate" value={`${overview.occupancyRate}%`} delta={overview.occupancyDelta} />
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Revenue Trends</h2>
        <RevenueLineChart data={trendData} />
      </div>
    </div>
  );
}
