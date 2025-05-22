'use client';

import React from 'react';

type Props = {
  weekData: {
    date: string;
    reservations: { id: string }[];
  }[];
};

export const WeekAnalytics = ({ weekData }: Props) => {
  return (
    <div className="bg-white p-4 border rounded shadow-md mt-6 w-full">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
        Weekly Summary
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {weekData.map((day) => (
          <div key={day.date} className="text-center border p-2 rounded bg-gray-50">
            <p className="text-xs sm:text-sm text-gray-600">{day.date}</p>
            <p className="text-lg font-bold text-blue-600">{day.reservations.length}</p>
            <p className="text-xs text-gray-500">reservations</p>
          </div>
        ))}
      </div>
    </div>
  );
};


// 'use client';

// import React from 'react';

// type Props = {
//   weekData: {
//     date: string;
//     reservations: { id: string }[];
//   }[];
// };

// export const WeekAnalytics = ({ weekData }: Props) => {
//   return (
//     <div className="bg-white p-4 border rounded shadow-md mt-6">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800">Weekly Summary</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         {weekData.map((day) => (
//           <div key={day.date} className="text-center border p-2 rounded bg-gray-50">
//             <p className="text-sm text-gray-600">{day.date}</p>
//             <p className="text-xl font-bold text-blue-600">{day.reservations.length}</p>
//             <p className="text-xs text-gray-500">reservations</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

