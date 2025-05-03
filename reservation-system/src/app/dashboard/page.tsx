'use client'; // re_WQZRvNWN_JUs8MrDunXXvqRTQUEHpbw5z

import React, { useEffect, useState } from 'react';
import { DashboardStatsCard } from '@/components/dashboard/dashboardStatsCard';
import { AnalyticsOverviewCard } from '@/components/dashboard/analyticsOverviewCard';
import { TableStatusCard } from '@/components/dashboard/tableStatusCard';
import { WeeklyPerformanceChart } from '@/components/dashboard/weeklyPerformanceChart';
import { RecentCustomersCard } from '@/components/dashboard/recentCustomersCard';
import { NewReservationModal } from '@/components/dashboard/newReservation';
import {
  getTotalReservations,
  getTotalRevenue,
  getOccupancyRate,
  getRecentCustomers,
} from '../../lib/supabase/dashboard';

import {
  CalendarDays,
  DollarSign,
  Users,
  Percent,
  Clock,
  Table,
  CircleSlash,
  AlertTriangle,
  Wrench,
  RefreshCcw,
  Plus,
} from 'lucide-react';

const DashboardPage = () => {
  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [occupancyRate, setOccupancyRate] = useState<number>(0);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [showNewReservation, setShowNewReservation] = useState(false);

  const fetchData = async () => {
    try {
      const reservations = await getTotalReservations();
      const revenue = await getTotalRevenue();
      const occupancy = await getOccupancyRate();
      const customers = await getRecentCustomers();

      setTotalReservations(reservations);
      setTotalRevenue(revenue);
      setOccupancyRate(occupancy);
      setRecentCustomers(customers);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-12 bg-gradient-to-b from-white to-gray-50 min-h-screen text-black">
      {/* Page Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">A snapshot of your restaurant's performance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded shadow text-sm"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Refresh Data
          </button>
          <button
            onClick={() => setShowNewReservation(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded shadow text-sm"
          >
            <Plus className="h-4 w-4 mr-1" /> New Reservation
          </button>
        </div>
      </div>

      {/* Top Stats Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardStatsCard
            title="Total Reservations"
            value={totalReservations.toString()}
            percentageChange={2.1}
            icon={<CalendarDays className="h-5 w-5" />}
          />
          <DashboardStatsCard
            title="New Customers"
            value={recentCustomers.length.toString()}
            percentageChange={1.7}
            icon={<Users className="h-5 w-5" />}
          />
          <DashboardStatsCard
            title="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            percentageChange={8.6}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <DashboardStatsCard
            title="Occupancy Rate"
            value={`${occupancyRate}%`}
            percentageChange={-1.2}
            icon={<Percent className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Analytics Overview Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticsOverviewCard
            title="Weekly Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            percentageChange={5.2}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="New Customers"
            value={recentCustomers.length.toString()}
            percentageChange={3.4}
            icon={<Users className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="Reservations"
            value={totalReservations.toString()}
            percentageChange={1.9}
            icon={<CalendarDays className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="Average Time"
            value="1.8h"
            percentageChange={6.5}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Table Status Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Table Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <TableStatusCard
            label="Available"
            count={10}
            percentage="55%"
            color="bg-green-100"
            icon={<Table className="h-5 w-5 text-green-600" />}
          />
          <TableStatusCard
            label="Reserved"
            count={2}
            percentage="15%"
            color="bg-yellow-100"
            icon={<CircleSlash className="h-5 w-5 text-yellow-500" />}
          />
          <TableStatusCard
            label="Occupied"
            count={5}
            percentage="25%"
            color="bg-blue-100"
            icon={<AlertTriangle className="h-5 w-5 text-blue-600" />}
          />
          <TableStatusCard
            label="Maintenance"
            count={1}
            percentage="5%"
            color="bg-red-100"
            icon={<Wrench className="h-5 w-5 text-red-600" />}
          />
        </div>
      </section>

      {/* Performance + Customers Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyPerformanceChart />
          </div>
          <RecentCustomersCard customers={recentCustomers} />
        </div>
      </section>

      {showNewReservation && (
        <NewReservationModal
          onClose={() => setShowNewReservation(false)}
          onComplete={async () => {
            setShowNewReservation(false);
            await fetchData();
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
