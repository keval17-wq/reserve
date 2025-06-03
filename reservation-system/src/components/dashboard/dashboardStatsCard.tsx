import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

type DashboardStatsCardProps = {
  title: string;
  value: string;
  percentageChange: number;
  icon: React.ReactNode;
};

export const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm font-medium">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? 'text-green-600' : 'text-red-600 ml-1'}>
          {percentageChange}%
        </span>
        <span className="ml-2 text-gray-400">vs last period</span>
      </div>
    </div>
  );
};


// // ─────────────────────────────────────────────
// // 🔹 Component: DashboardStatsCard (Enhanced UI)
// // 🔹 Purpose: Display single dashboard metric (Reservation, Revenue, etc.)
// // 🔹 Created: April 29, 2025
// // 🔹 Author: Keval Gandhi
// // 🔹 Version: Premium UI – Solid Block Variant
// // ─────────────────────────────────────────────

// import { ArrowDown, ArrowUp } from 'lucide-react';
// import React from 'react';

// type DashboardStatsCardProps = {
//   title: string;
//   value: string;
//   percentageChange: number;
//   icon: React.ReactNode;
// };

// export const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
//   title,
//   value,
//   percentageChange,
//   icon,
// }) => {
//   const isPositive = percentageChange >= 0;

//   return (
//     <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
//       <div className="flex items-start justify-between">
//         <div className="space-y-1">
//           <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//           <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
//         </div>
//         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
//           {icon}
//         </div>
//       </div>

//       <div className="mt-4 flex items-center text-sm font-medium">
//         {isPositive ? (
//           <ArrowUp className="h-4 w-4 text-green-500" />
//         ) : (
//           <ArrowDown className="h-4 w-4 text-red-500" />
//         )}
//         <span className={isPositive ? 'text-green-600' : 'text-red-600 ml-1'}>
//           {percentageChange}%
//         </span>
//         <span className="ml-2 text-gray-400">vs last period</span>
//       </div>
//     </div>
//   );
// };

