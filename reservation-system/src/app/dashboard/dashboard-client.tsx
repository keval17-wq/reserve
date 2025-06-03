// src/app/dashboard/dashboard-client.tsx
'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

import { DashboardStatsCard } from '@/components/dashboard/dashboardStatsCard';
import { AnalyticsOverviewCard } from '@/components/dashboard/analyticsOverviewCard';
import { TableStatusCard } from '@/components/dashboard/tableStatusCard';
import { WeeklyPerformanceChart } from '@/components/dashboard/weeklyPerformanceChart';
import { RecentCustomersCard } from '@/components/dashboard/recentCustomersCard';
import { NewReservationModal } from '@/components/dashboard/newReservation';
import {
  AlertTriangle,
  CalendarDays,
  CircleSlash,
  DollarSign,
  Percent,
  Table,
  Users,
  Wrench,
} from 'lucide-react';

type DashboardStats = {
  totalReservations: number;
  totalRevenue: number;
  occupancyRate: number;
};

type TableStatusCounts = {
  available: number;
  reserved: number;
  occupied: number;
  maintenance: number;
};

type Customer = {
  full_name: string;
  email: string;
  created_at: string;
};

export type DashboardProps = {
  stats: DashboardStats;
  tableStatus: TableStatusCounts;
  weeklyRevenue: Array<{ date: string; revenue: number }>;
  recentCustomers: Customer[];
  nextReservations: Array<{
    id: string;
    customer_name: string;
    reservation_date: string;
    reservation_time: string;
    table_number: number;
  }>;
};

const DashboardClient: React.FC<DashboardProps> = ({
  stats,
  tableStatus,
  weeklyRevenue,
  recentCustomers,
  nextReservations,
}) => {
  const [showModal, setShowModal] = useState(false);

  const totalTablesCount =
    tableStatus.available +
    tableStatus.reserved +
    tableStatus.occupied +
    tableStatus.maintenance;

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'MMMM do, yyyy')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <span className="mr-2 h-5 w-5">
            <CalendarDays />
          </span>
          New Reservation
        </button>
      </div>

      {/* Top Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardStatsCard
          title="Reservations (This Month)"
          value={stats.totalReservations.toString()}
          percentageChange={0}
          icon={<CalendarDays className="h-6 w-6 text-indigo-600" />}
        />
        <DashboardStatsCard
          title="Revenue (This Month)"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          percentageChange={0}
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
        <DashboardStatsCard
          title="Occupancy Rate (Today)"
          value={`${stats.occupancyRate}%`}
          percentageChange={0}
          icon={<Users className="h-6 w-6 text-green-600" />}
        />
        <AnalyticsOverviewCard
          title="Next 5 Reservations"
          value={nextReservations.length.toString()}
          percentageChange={0}
          icon={<Percent className="h-6 w-6 text-purple-600" />}
        />
      </section>

      {/* Table Status */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Table Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <TableStatusCard
            label="Available"
            count={tableStatus.available}
            percentage={`${Math.round(
              (tableStatus.available / totalTablesCount) * 100
            )}%`}
            color="bg-green-100"
            icon={<Table className="h-6 w-6 text-green-600" />}
          />
          <TableStatusCard
            label="Reserved"
            count={tableStatus.reserved}
            percentage={`${Math.round(
              (tableStatus.reserved / totalTablesCount) * 100
            )}%`}
            color="bg-yellow-100"
            icon={<CircleSlash className="h-6 w-6 text-yellow-600" />}
          />
          <TableStatusCard
            label="Occupied"
            count={tableStatus.occupied}
            percentage={`${Math.round(
              (tableStatus.occupied / totalTablesCount) * 100
            )}%`}
            color="bg-blue-100"
            icon={<AlertTriangle className="h-6 w-6 text-blue-600" />}
          />
          <TableStatusCard
            label="Maintenance"
            count={tableStatus.maintenance}
            percentage={`${Math.round(
              (tableStatus.maintenance / totalTablesCount) * 100
            )}%`}
            color="bg-red-100"
            icon={<Wrench className="h-6 w-6 text-red-600" />}
          />
        </div>
      </section>

      {/* Weekly Revenue & Recent Customers */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Weekly Revenue
          </h3>
          <WeeklyPerformanceChart data={weeklyRevenue} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Customers
          </h3>
          <RecentCustomersCard
            customers={recentCustomers.map((c) => ({
              name: c.full_name,
              created_at: c.created_at,
            }))}
          />
        </div>
      </section>

      {/* Upcoming Reservations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Upcoming Reservations
        </h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul>
            {nextReservations.map((r, idx) => (
              <li
                key={r.id}
                className={`flex justify-between items-center px-6 py-4 ${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {r.customer_name} — Table {r.table_number}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(
                      new Date(r.reservation_date + 'T' + r.reservation_time),
                      'HH:mm'
                    )}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {format(
                    new Date(r.reservation_date),
                    'MMM d, yyyy'
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* New Reservation Modal */}
      {showModal && (
        <NewReservationModal
          onClose={() => setShowModal(false)}
          onComplete={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardClient;


// // src/app/dashboard/dashboard-client.tsx
// 'use client';

// import React, { useState } from 'react';
// import { format } from 'date-fns';

// import { DashboardStatsCard } from '@/components/dashboard/dashboardStatsCard';
// import { AnalyticsOverviewCard } from '@/components/dashboard/analyticsOverviewCard';
// import { TableStatusCard } from '@/components/dashboard/tableStatusCard';
// import { WeeklyPerformanceChart } from '@/components/dashboard/weeklyPerformanceChart';
// import { RecentCustomersCard } from '@/components/dashboard/recentCustomersCard';
// import { NewReservationModal } from '@/components/dashboard/newReservation';
// import {
//   AlertTriangle,
//   CalendarDays,
//   CircleSlash,
//   DollarSign,
//   Percent,
//   Table,
//   Users,
//   Wrench,
// } from 'lucide-react';

// type DashboardStats = {
//   totalReservations: number;
//   totalRevenue: number;
//   occupancyRate: number;
// };

// type TableStatusCounts = {
//   available: number;
//   reserved: number;
//   occupied: number;
//   maintenance: number;
// };

// type Customer = {
//   full_name: string;
//   email: string;
//   created_at: string;
// };

// export type DashboardProps = {
//   stats: DashboardStats;
//   tableStatus: TableStatusCounts;
//   weeklyRevenue: Array<{ date: string; revenue: number }>;
//   recentCustomers: Customer[];
//   nextReservations: Array<{
//     id: string;
//     customer_name: string;
//     reservation_date: string;
//     reservation_time: string;
//     table_number: number;
//   }>;
// };

// const DashboardClient: React.FC<DashboardProps> = ({
//   stats,
//   tableStatus,
//   weeklyRevenue,
//   recentCustomers,
//   nextReservations,
// }) => {
//   const [showModal, setShowModal] = useState(false);

//   const totalTablesCount =
//     tableStatus.available +
//     tableStatus.reserved +
//     tableStatus.occupied +
//     tableStatus.maintenance;

//   return (
//     <div className="bg-white text-black min-h-screen p-8 space-y-8">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-semibold">
//           Dashboard — {format(new Date(), 'MMMM do, yyyy')}
//         </h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded shadow text-sm"
//         >
//           New Reservation
//         </button>
//       </div>

//       {/* Top Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <DashboardStatsCard
//           title="Reservations (This Month)"
//           value={stats.totalReservations.toString()}
//           percentageChange={0}
//           icon={<CalendarDays className="h-5 w-5" />}
//         />
//         <DashboardStatsCard
//           title="Revenue (This Month)"
//           value={`$${stats.totalRevenue.toFixed(2)}`}
//           percentageChange={0}
//           icon={<DollarSign className="h-5 w-5" />}
//         />
//         <DashboardStatsCard
//           title="Occupancy Rate (Today)"
//           value={`${stats.occupancyRate}%`}
//           percentageChange={0}
//           icon={<Users className="h-5 w-5" />}
//         />
//         <AnalyticsOverviewCard
//           title="Next 5 Reservations"
//           value={nextReservations.length.toString()}
//           percentageChange={0}
//           icon={<Percent className="h-5 w-5" />}
//         />
//       </div>

//       {/* Table Status */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Table Status</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//           <TableStatusCard
//             label="Available"
//             count={tableStatus.available}
//             percentage={`${Math.round(
//               (tableStatus.available / totalTablesCount) * 100
//             )}%`}
//             color="bg-green-100"
//             icon={<Table className="h-5 w-5 text-green-600" />}
//           />
//           <TableStatusCard
//             label="Reserved"
//             count={tableStatus.reserved}
//             percentage={`${Math.round(
//               (tableStatus.reserved / totalTablesCount) * 100
//             )}%`}
//             color="bg-yellow-100"
//             icon={<CircleSlash className="h-5 w-5 text-yellow-500" />}
//           />
//           <TableStatusCard
//             label="Occupied"
//             count={tableStatus.occupied}
//             percentage={`${Math.round(
//               (tableStatus.occupied / totalTablesCount) * 100
//             )}%`}
//             color="bg-blue-100"
//             icon={<AlertTriangle className="h-5 w-5 text-blue-600" />}
//           />
//           <TableStatusCard
//             label="Maintenance"
//             count={tableStatus.maintenance}
//             percentage={`${Math.round(
//               (tableStatus.maintenance / totalTablesCount) * 100
//             )}%`}
//             color="bg-red-100"
//             icon={<Wrench className="h-5 w-5 text-red-600" />}
//           />
//         </div>
//       </section>

//       {/* Weekly Revenue Chart & Recent Customers */}
//       <section>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <WeeklyPerformanceChart data={weeklyRevenue} />
//           </div>
//           <RecentCustomersCard
//             customers={recentCustomers.map((c) => ({
//               name: c.full_name,
//               created_at: c.created_at,
//             }))}
//           />
//         </div>
//       </section>

//       {/* Upcoming Reservations (24-hour format) */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
//         <ul className="bg-white rounded shadow divide-y">
//           {nextReservations.map((r) => (
//             <li
//               key={r.id}
//               className="flex justify-between items-center p-4"
//             >
//               <div>
//                 <p className="font-medium">
//                   {r.customer_name} — Table {r.table_number}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   {format(
//                     new Date(r.reservation_date + 'T' + r.reservation_time),
//                     'HH:mm'
//                   )}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* New Reservation Modal */}
//       {showModal && (
//         <NewReservationModal
//           onClose={() => setShowModal(false)}
//           onComplete={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default DashboardClient;

