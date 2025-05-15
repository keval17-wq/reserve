// ─────────────────────────────────────────────
// 🔹 Component: RecentCustomersCard
// 🔹 Purpose: List recent customers from past 24h
// 🔹 Created: April 30, 2025
// 🔹 Author: Keval Gandhi
// ─────────────────────────────────────────────

import React from 'react';

type Props = {
  customers: { name: string; created_at: string }[];
};

export const RecentCustomersCard = ({ customers }: Props) => {
  return (
    <div className="p-6 rounded-lg border bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Recent Customers
      </h2>
      <ul className="space-y-2">
        {customers.length === 0 ? (
          <li className="text-gray-400 text-sm">No customers found.</li>
        ) : (
          customers.map((c, i) => (
            <li key={i} className="text-sm text-gray-800 flex justify-between">
              <span>{c.name}</span>
              <span className="text-gray-500">{new Date(c.created_at).toLocaleTimeString()}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};


// // ─────────────────────────────────────────────
// // 🔹 Component: RecentCustomersCard
// // 🔹 Purpose: List recent customers from past 24h
// // 🔹 Created: April 30, 2025
// // 🔹 Author: Keval Gandhi
// // ─────────────────────────────────────────────

// import React from 'react';

// type Customer = {
//   name: string;
//   time: string;
// };

// type Props = {
//   customers: { name: string; created_at: string }[];
// };

// export const RecentCustomersCard = ({ customers }: Props) => {
//   return (
//     <div className="p-6 rounded-lg border bg-white">
//       <h2 className="text-lg font-semibold mb-4 text-gray-700">
//         Recent Customers
//       </h2>
//       <ul className="space-y-2">
//         {customers.length === 0 ? (
//           <li className="text-gray-400 text-sm">No customers found.</li>
//         ) : (
//           customers.map((c, i) => (
//             <li key={i} className="text-sm text-gray-800 flex justify-between">
//               <span>{c.name}</span>
//               <span className="text-gray-500">{new Date(c.created_at).toLocaleTimeString()}</span>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// };

