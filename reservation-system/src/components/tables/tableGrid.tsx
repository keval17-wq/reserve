// 'use client';

// import { TableWithReservations } from '@/lib/supabase/tables';
// import { TableCard } from './tableCard';

// export const TableGrid = ({
//   tables,
//   onCancel,
// }: {
//   tables: TableWithReservations[];
//   onCancel: (
//     id: string,
//     email: string,
//     name: string,
//     time: string,
//     partySize: number
//   ) => void;
// }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//       {tables.map((table) => (
//         <TableCard
//           key={table.id}
//           {...table}
//           onCancel={onCancel}
//         />
//       ))}
//     </div>
//   );
// };
