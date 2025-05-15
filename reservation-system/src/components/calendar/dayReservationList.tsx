// ✅ components/calendar/dayReservationList.tsx
type Reservation = {
  id: string;
  customer_name: string;
  reservation_time: string;
  table_number: number;
};

export const DayReservationList = ({
  reservations,
  onSelect,
}: {
  reservations: Reservation[];
  onSelect: (r: Reservation) => void;
}) => (
  <div className="space-y-2 mt-4">
    {reservations.length === 0 ? (
      <p className="text-sm text-gray-400">No reservations for this day.</p>
    ) : (
      reservations.map((res) => (
        <div
          key={res.id}
          onClick={() => onSelect(res)}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded border cursor-pointer"
        >
          <p className="text-sm font-medium">{res.customer_name}</p>
          <p className="text-xs text-gray-500">Table {res.table_number} @ {new Date(res.reservation_time).toLocaleTimeString()}</p>
        </div>
      ))
    )}
  </div>
);
