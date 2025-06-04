// src/app/analytics/analytics-client.tsx
'use client';

import React from 'react';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';


const COLORS = ['#4CAF50', '#FFC107', '#2196F3', '#F44336']; // green, amber, blue, red

export type AnalyticsProps = {
  weeklyRevenue: Array<{ date: string; revenue: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  tableStatusCounts: Record<string, number>;
  totalCustomers: number;
  totalReservations: number;
};

const AnalyticsClient: React.FC<AnalyticsProps> = ({
  weeklyRevenue,
  monthlyRevenue,
  tableStatusCounts,
  totalCustomers,
  totalReservations,
}) => {
  // Prepare data for pie chart
  const pieData = Object.entries(tableStatusCounts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));
  // Order pie slices in the same order as COLORS
  const statusOrder = ['Available', 'Reserved', 'Occupied', 'Maintenance'];
  const orderedPieData = statusOrder
    .map((label) => pieData.find((d) => d.name === label))
    .filter((d): d is { name: string; value: number } => !!d);

  return (
    <div className="bg-white text-black min-h-screen p-8 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Analytics</h1>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h2 className="text-sm text-gray-600">Total Customers</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalCustomers}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h2 className="text-sm text-gray-600">Reservations (This Month)</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalReservations}</p>
        </div>
        <div className="col-span-2 p-6 bg-gray-100 rounded-lg shadow">
          <h2 className="text-sm text-gray-600">Table Status Distribution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderedPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {orderedPieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Weekly Revenue Bar Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Revenue (Last 7 Days)</h2>
        <div className="h-64 bg-gray-100 rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyRevenue}>
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(new Date(d), 'MM/dd')}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) =>
                  `Date: ${format(new Date(label), 'MMMM do, yyyy')}`
                }
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Monthly Revenue Bar Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Revenue (Last 6 Months)</h2>
        <div className="h-64 bg-gray-100 rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsClient;
