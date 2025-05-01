// ─────────────────────────────────────────────
// 🔹 Component: WeeklyPerformanceChart
// 🔹 Purpose: Line chart for reservations & revenue trends
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const sampleData = [
  { day: 'Mon', reservations: 5, revenue: 400 },
  { day: 'Tue', reservations: 8, revenue: 900 },
  { day: 'Wed', reservations: 3, revenue: 300 },
  { day: 'Thu', reservations: 6, revenue: 1200 },
  { day: 'Fri', reservations: 10, revenue: 2000 },
  { day: 'Sat', reservations: 12, revenue: 3100 },
  { day: 'Sun', reservations: 4, revenue: 700 },
];

export const WeeklyPerformanceChart = () => {
  return (
    <div className="p-6 rounded-lg border bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Weekly Performance Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="reservations" stroke="#3B82F6" />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
