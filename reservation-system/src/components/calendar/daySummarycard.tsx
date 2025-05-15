// ✅ components/calendar/daySummaryCard.tsx
type DaySummaryCardProps = {
  date: string;
  count: number;
};

export const DaySummaryCard = ({ date, count }: DaySummaryCardProps) => (
  <div className="p-3 border rounded-lg shadow-sm bg-white">
    <h4 className="text-sm font-semibold">{date}</h4>
    <p className="text-xs text-gray-500">{count} reservations</p>
  </div>
);
