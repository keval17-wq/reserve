// ✅ components/calendar/weekAnalytics.tsx

'use client';

import React from 'react';

type DayData = {
  day: string; // e.g., 'Monday'
  count: number; // number of reservations
};

interface WeekAnalyticsProps {
  data: DayData[];
}

export const WeekAnalytics: React.FC<WeekAnalyticsProps> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const max = Math.max(...data.map(d => d.count), 1); // avoid division by 0

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Analytics</h3>
      <ul className="space-y-2">
        {data.map((day) => (
          <li key={day.day} className="flex justify-between items-center text-sm text-gray-700">
            <span>{day.day}</span>
            <div className="flex items-center space-x-2">
              <span>{day.count}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(day.count / max) * 100}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pt-4 mt-4 border-t text-right text-xs text-gray-500">
        Total Reservations: {total}
      </div>
    </div>
  );
};
