'use client';

import React from 'react';
import { DashboardStatsCard } from '@/components/dashboard/dashboardStatsCard';
import { AnalyticsOverviewCard } from '../../components/dashboard/analyticsOverviewCard';
import { TableStatusCard } from '@/components/dashboard/tableStatusCard';
import { WeeklyPerformanceChart } from '@/components/dashboard/weeklyPerformanceChart';
import { RecentCustomersCard } from '@/components/dashboard/recentCustomersCard';

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
} from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-12">
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardStatsCard
          title="Total Reservations"
          value="41"
          percentageChange={-4.9}
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <DashboardStatsCard
          title="New Customers"
          value="12"
          percentageChange={5.2}
          icon={<Users className="h-5 w-5" />}
        />
        <DashboardStatsCard
          title="Revenue"
          value="$12,580"
          percentageChange={8.6}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <DashboardStatsCard
          title="Occupancy Rate"
          value="74%"
          percentageChange={-2.1}
          icon={<Percent className="h-5 w-5" />}
        />
      </div>

      {/* Analytics Overview Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticsOverviewCard
            title="Weekly Revenue"
            value="$12,580"
            percentageChange={12.3}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="New Customers"
            value="32"
            percentageChange={8.7}
            icon={<Users className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="Reservations"
            value="186"
            percentageChange={-3.2}
            icon={<CalendarDays className="h-5 w-5" />}
          />
          <AnalyticsOverviewCard
            title="Average Time"
            value="1.8h"
            percentageChange={6.5}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Table Status Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Table Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <TableStatusCard
            label="Available"
            count={10}
            percentage="77%"
            color="bg-green-100"
            icon={<Table className="h-5 w-5 text-green-600" />}
          />
          <TableStatusCard
            label="Reserved"
            count={0}
            percentage="0%"
            color="bg-yellow-100"
            icon={<CircleSlash className="h-5 w-5 text-yellow-500" />}
          />
          <TableStatusCard
            label="Occupied"
            count={2}
            percentage="15%"
            color="bg-blue-100"
            icon={<AlertTriangle className="h-5 w-5 text-blue-600" />}
          />
          <TableStatusCard
            label="Maintenance"
            count={1}
            percentage="8%"
            color="bg-red-100"
            icon={<Wrench className="h-5 w-5 text-red-600" />}
          />
        </div>
      </div>

      {/* Performance + Recent Customers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyPerformanceChart />
        </div>
        <RecentCustomersCard />
      </div>
    </div>
  );
};

export default DashboardPage;
