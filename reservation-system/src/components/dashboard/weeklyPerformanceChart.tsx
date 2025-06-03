// src/components/dashboard/weeklyPerformanceChart.tsx
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format, parseISO } from 'date-fns';

type DailyRevenue = {
  date: string;    // 'YYYY-MM-DD'
  revenue: number;
};

type WeeklyPerformanceChartProps = {
  data: DailyRevenue[]; // array of last 7 days with date & revenue
};

/**
 * Converts each { date, revenue } to { day, revenue }
 * where day is a 3-letter abbreviation (e.g. 'Mon', 'Tue').
 */
const formatData = (raw: DailyRevenue[]) =>
  raw.map((entry) => ({
    day: format(parseISO(entry.date), 'EEE'),
    revenue: entry.revenue,
  }));

export const WeeklyPerformanceChart: React.FC<WeeklyPerformanceChartProps> = ({
  data,
}) => {
  const chartData = formatData(data);

  return (
    <div className="p-6 rounded-lg border bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Weekly Performance Overview
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Line type="monotone" dataKey="revenue" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


// // ─────────────────────────────────────────────
// // 🔹 Component: WeeklyPerformanceChart
// // 🔹 Purpose: Line chart for reservations & revenue trends
// // 🔹 Created: April 30, 2025
// // 🔹 Author: Keval Gandhi
// // ─────────────────────────────────────────────

// 'use client';

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from 'recharts';

// const sampleData = [
//   { day: 'Mon', reservations: 5, revenue: 400 },
//   { day: 'Tue', reservations: 8, revenue: 900 },
//   { day: 'Wed', reservations: 3, revenue: 300 },
//   { day: 'Thu', reservations: 6, revenue: 1200 },
//   { day: 'Fri', reservations: 10, revenue: 2000 },
//   { day: 'Sat', reservations: 12, revenue: 3100 },
//   { day: 'Sun', reservations: 4, revenue: 700 },
// ];

// export const WeeklyPerformanceChart = () => {
//   return (
//     <div className="p-6 rounded-lg border bg-white">
//       <h2 className="text-lg font-semibold mb-4 text-gray-700">
//         Weekly Performance Overview
//       </h2>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={sampleData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="day" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="reservations" stroke="#3B82F6" />
//           <Line type="monotone" dataKey="revenue" stroke="#10B981" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };
