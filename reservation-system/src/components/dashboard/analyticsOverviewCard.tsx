// ─────────────────────────────────────────────
// 🔹 Component: AnalyticsOverviewCard (Premium Block Style)
// 🔹 Purpose: Display a stat card with clear sectioning, modern tone
// 🔹 Version: Premium Solid Layout
// ─────────────────────────────────────────────

import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

type AnalyticsOverviewCardProps = {
  title: string;
  value: string;
  percentageChange: number;
  icon: React.ReactNode;
};

export const AnalyticsOverviewCard: React.FC<AnalyticsOverviewCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  const isPositive = percentageChange >= 0;

  return (
    <div className="w-full rounded-xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-500 font-medium">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
          {percentageChange}%
        </span>
        <span className="text-gray-400 ml-1">vs last period</span>
      </div>
    </div>
  );
};


// // ─────────────────────────────────────────────
// // 🔹 Component: AnalyticsOverviewCard
// // 🔹 Purpose: Display a small metric box with title, value, icon & trend
// // 🔹 Created: April 30, 2025
// // 🔹 Author: Keval Gandhi
// // ─────────────────────────────────────────────

// import { ArrowDown, ArrowUp } from 'lucide-react';
// import React from 'react';

// type AnalyticsOverviewCardProps = {
//   title: string;
//   value: string;
//   percentageChange: number;
//   icon: React.ReactNode;
// };

// export const AnalyticsOverviewCard: React.FC<AnalyticsOverviewCardProps> = ({
//   title,
//   value,
//   percentageChange,
//   icon,
// }) => {
//   const isPositive = percentageChange >= 0;

//   return (
//     <div className="flex flex-col justify-between rounded-lg border p-4 shadow-sm bg-white w-full">
//       <div className="flex items-center justify-between">
//         <div className="text-sm text-gray-500">{title}</div>
//         <div className="text-blue-500">{icon}</div>
//       </div>
//       <div className="mt-3 flex items-center justify-between">
//         <div className="text-xl font-bold text-gray-800">{value}</div>
//         <div className="flex items-center text-sm space-x-1">
//           {isPositive ? (
//             <ArrowUp className="w-4 h-4 text-green-500" />
//           ) : (
//             <ArrowDown className="w-4 h-4 text-red-500" />
//           )}
//           <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
//             {percentageChange}%
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
