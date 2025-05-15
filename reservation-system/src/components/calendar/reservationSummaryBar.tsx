// ✅ components/calendar/reservationSummaryBar.tsx
export const ReservationSummaryBar = ({
  total,
  occupancyRate,
}: {
  total: number;
  occupancyRate: number;
}) => (
  <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4 text-sm">
    <span className="font-medium">{total}</span> reservations this week.
    <span className="ml-4 font-medium text-blue-700">Occupancy: {occupancyRate}%</span>
  </div>
);
