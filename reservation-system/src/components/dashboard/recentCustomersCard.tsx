// ─────────────────────────────────────────────
// 🔹 Component: RecentCustomersCard
// 🔹 Purpose: List recent customers from past 24h
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import React from 'react';

type Customer = {
  name: string;
  time: string;
};

const mockCustomers: Customer[] = [
  { name: 'Alice', time: '2 hours ago' },
  { name: 'Bob', time: '4 hours ago' },
  { name: 'Charlie', time: '6 hours ago' },
];

export const RecentCustomersCard = () => {
  return (
    <div className="p-6 rounded-lg border bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Recent Customers
      </h2>
      <ul className="space-y-2">
        {mockCustomers.length === 0 ? (
          <li className="text-gray-400 text-sm">No customers in the last 24 hours.</li>
        ) : (
          mockCustomers.map((c, i) => (
            <li key={i} className="text-sm text-gray-800 flex justify-between">
              <span>{c.name}</span>
              <span className="text-gray-500">{c.time}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
