// src/app/calendar/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';

import {
  getReservationsByDate,
  getReservationsByDateRange,
  cancelReservation,
  approveReservation,
  getAllTables,
  ReservationRow,
  TableRow,
} from '@/lib/supabase/calendar';

export default function CalendarPage() {
  // 1. Compute the current week’s Monday (week start) and Sunday (week end)
  const today = new Date();
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(today, { weekStartsOn: 1 })
  );
  const [weekEnd, setWeekEnd] = useState<Date>(
    endOfWeek(today, { weekStartsOn: 1 })
  );

  // 2. Track selectedDate (for day view), default to today
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().slice(0, 10)
  );

  // 3. Store reservations for the entire week
  const [weekReservations, setWeekReservations] = useState<ReservationRow[]>([]);

  // 4. Store daily (selectedDate) reservations
  const [dayReservations, setDayReservations] = useState<ReservationRow[]>([]);

  // 5. Tables list (for optional table filtering or reassignment)
  const [tables, setTables] = useState<TableRow[]>([]);

  // 6. Loading flags
  const [, setLoadingWeek] = useState<boolean>(true);
  const [loadingDay, setLoadingDay] = useState<boolean>(true);

  // 7. Filter by table for day view
  const [filterTable, setFilterTable] = useState<number | ''>('');

  // ─── Fetch WEEK reservations + all tables whenever weekStart or weekEnd changes ────────────────────────
  useEffect(() => {
    async function fetchWeekData() {
      setLoadingWeek(true);
      try {
        const [resWeek, allTables] = await Promise.all([
          getReservationsByDateRange(
            weekStart.toISOString().slice(0, 10),
            weekEnd.toISOString().slice(0, 10)
          ),
          getAllTables(),
        ]);
        setWeekReservations(resWeek);
        setTables(allTables);
      } catch (err) {
        console.error('Error fetching week reservations:', err);
      } finally {
        setLoadingWeek(false);
      }
    }
    fetchWeekData();
  }, [weekStart, weekEnd]);

  // ─── Fetch DAY reservations whenever selectedDate changes ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchDayData() {
      setLoadingDay(true);
      try {
        const resDay = await getReservationsByDate(selectedDate);
        setDayReservations(resDay);
      } catch (err) {
        console.error('Error fetching day reservations:', err);
      } finally {
        setLoadingDay(false);
      }
    }
    fetchDayData();
  }, [selectedDate]);

  // ─── Handlers to navigate prev/next week ────────────────────────────────────────────────────────────────
  const goToPrevWeek = () => {
    const newStart = subDays(weekStart, 7);
    const newEnd = subDays(weekEnd, 7);
    setWeekStart(newStart);
    setWeekEnd(newEnd);
    // Also adjust selectedDate into that week if it falls outside
    const sel = new Date(selectedDate);
    if (sel < newStart || sel > newEnd) {
      setSelectedDate(newStart.toISOString().slice(0, 10));
    }
  };

  const goToNextWeek = () => {
    const newStart = addDays(weekStart, 7);
    const newEnd = addDays(weekEnd, 7);
    setWeekStart(newStart);
    setWeekEnd(newEnd);
    const sel = new Date(selectedDate);
    if (sel < newStart || sel > newEnd) {
      setSelectedDate(newStart.toISOString().slice(0, 10));
    }
  };

  // ─── Handlers to approve or cancel a reservation and then refresh day/week views ─────────────────────────
  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await cancelReservation(id);
      // Refresh both day & week
      const [updatedWeek, updatedDay] = await Promise.all([
        getReservationsByDateRange(
          weekStart.toISOString().slice(0, 10),
          weekEnd.toISOString().slice(0, 10)
        ),
        getReservationsByDate(selectedDate),
      ]);
      setWeekReservations(updatedWeek);
      setDayReservations(updatedDay);
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Failed to cancel reservation.');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReservation(id);
      const [updatedWeek, updatedDay] = await Promise.all([
        getReservationsByDateRange(
          weekStart.toISOString().slice(0, 10),
          weekEnd.toISOString().slice(0, 10)
        ),
        getReservationsByDate(selectedDate),
      ]);
      setWeekReservations(updatedWeek);
      setDayReservations(updatedDay);
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve reservation.');
    }
  };

  // ─── Compute an array of 7 dates (strings) for the week bar ─────────────────────────────────────────────
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i).toISOString().slice(0, 10)
  );

  // ─── Count reservations per day (for week bar badges) ───────────────────────────────────────────────────
  const countsByDate: Record<string, number> = {};
  weekReservations.forEach((r) => {
    countsByDate[r.reservation_date] =
      (countsByDate[r.reservation_date] || 0) + 1;
  });

  // ─── Filter day reservations by selected table if needed ───────────────────────────────────────────────
  const displayedDayReservations = filterTable
    ? dayReservations.filter((r) => r.table_number === filterTable)
    : dayReservations;

  return (
    <div className="bg-white text-black min-h-screen p-6 space-y-6">
      {/* ─── Week Navigation Bar ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevWeek}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Previous
        </button>
        <h2 className="text-2xl font-semibold">
          Week of {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        <button
          onClick={goToNextWeek}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next →
        </button>
      </div>

      {/* ─── Day Buttons (with counts) ─────────────────────────────────────────────────────────────────────── */}
      <div className="flex space-x-2 overflow-x-auto">
        {weekDates.map((dateStr) => {
          const count = countsByDate[dateStr] || 0;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-1 min-w-[100px] p-3 text-center rounded ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{format(new Date(dateStr), 'EEE')}</div>
              <div className="text-sm">{format(new Date(dateStr), 'MMM d')}</div>
              <div className="mt-1 inline-block bg-blue-500 text-white text-xs font-semibold rounded-full px-2">
                {count}
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Day View Header: Date Picker & Table Filter ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg font-medium">
          Detailed Reservations for {format(new Date(selectedDate), 'PPP')}
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Table</label>
            <select
              value={filterTable}
              onChange={(e) =>
                setFilterTable(e.target.value === '' ? '' : +e.target.value)
              }
              className="mt-1 border rounded-lg px-3 py-2"
            >
              <option value="">All Tables</option>
              {tables.map((t) => (
                <option key={t.id} value={t.table_number}>
                  Table {t.table_number}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Day Reservations List ───────────────────────────────────────────────────────────────────────── */}
      {loadingDay ? (
        <p className="text-gray-500">Loading reservations…</p>
      ) : displayedDayReservations.length === 0 ? (
        <p className="text-gray-500">No reservations on this date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Time
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Table #
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Persons
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Revenue
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedDayReservations.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-800">{r.customer_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {format(new Date(r.reservation_date + 'T' + r.reservation_time), 'HH:mm')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{r.table_number}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{r.persons}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    ${r.revenue.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {r.status === 'confirmed' ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    ) : r.status === 'pending' ? (
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    {r.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Cancel
                      </button>
                    )}
                    {r.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


// 'use client';

// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   getReservationsByMonth,
//   type Reservation,
// } from '@/lib/supabase/calendar';
// import { CalendarHeader } from '@/components/calendar/calendarHeader';
// import { WeekView } from '@/components/calendar/weekView';
// import { WeekAnalytics } from '@/components/calendar/weekAnalytics';
// import { ReservationList } from '@/components/calendar/reservationList';
// import ReservationModal from '@/components/calendar/reservationModal';

// const TZ = 'Australia/Sydney';

// export default function CalendarPage() {
//   // ── state
//   const [currentWeekStart, setCurrentWeekStart] = useState(() => {
//     const today = new Date();
//     const start = new Date(today);
//     start.setDate(today.getDate() - today.getDay());
//     return start;
//   });

//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [selectedDateISO, setSelectedDateISO] = useState(() =>
//     new Date().toISOString().split('T')[0],
//   );
//   const [selectedReservation, setSelectedReservation] =
//     useState<Reservation | null>(null);
//   const [view, setView] = useState<'week' | 'day'>('week');

//   // ── data fetch
//   const fetchReservations = useCallback(async () => {
//     const y = currentWeekStart.getFullYear();
//     const m = currentWeekStart.getMonth() + 1;
//     setReservations(await getReservationsByMonth(y, m));
//   }, [currentWeekStart]);

//   useEffect(() => {
//     fetchReservations();
//   }, [fetchReservations]);

//   // ── week data
//   const weekData = Array.from({ length: 7 }, (_, i) => {
//     const day = new Date(currentWeekStart);
//     day.setDate(currentWeekStart.getDate() + i);
//     const iso = day.toISOString().split('T')[0];

//     return {
//       date: iso,
//       label: day.toLocaleDateString('en-AU', {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//         timeZone: TZ,
//       }),
//       reservations: reservations.filter(r => {
//         const localDate = new Date(r.reservation_time).toLocaleDateString(
//           'en-CA',
//           { timeZone: TZ },
//         );
//         return localDate === iso;
//       }),
//     };
//   });

//   const selectedDayData = weekData.find(w => w.date === selectedDateISO);

//   // ── render
//   return (
//     <div className="min-h-screen space-y-8 bg-white p-6 text-black">
//       {/* header */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//         <h1 className="mb-4 text-3xl font-bold lg:mb-0">Calendar</h1>
//         <CalendarHeader
//           currentWeekStart={currentWeekStart}
//           onPrev={() =>
//             setCurrentWeekStart(
//               prev => new Date(prev.getTime() - 7 * 86_400_000),
//             )
//           }
//           onNext={() =>
//             setCurrentWeekStart(
//               prev => new Date(prev.getTime() + 7 * 86_400_000),
//             )
//           }
//           onToday={() => {
//             const today = new Date();
//             const start = new Date(today);
//             start.setDate(today.getDate() - today.getDay());
//             setCurrentWeekStart(start);
//             setSelectedDateISO(today.toISOString().split('T')[0]);
//           }}
//           view={view}
//           setView={setView}
//         />
//       </div>

//       <WeekAnalytics weekData={weekData} />

//       <WeekView
//         weekData={weekData}
//         selectedDate={selectedDateISO}
//         onSelectDay={d => setSelectedDateISO(d.date)}
//       />

//       <ReservationList
//         dayLabel={selectedDayData?.label ?? ''}
//         reservations={selectedDayData?.reservations ?? []}
//         onSelect={setSelectedReservation}
//       />

//       <ReservationModal
//         reservation={selectedReservation}
//         open={Boolean(selectedReservation)}
//         onClose={() => setSelectedReservation(null)}
//         onRefresh={fetchReservations}
//       />
//     </div>
//   );
// }

