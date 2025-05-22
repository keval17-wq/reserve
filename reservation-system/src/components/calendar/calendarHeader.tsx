'use client';

import React from 'react';

type Props = {
  currentWeekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const CalendarHeader = ({ currentWeekStart, onPrev, onNext, onToday }: Props) => {
  const endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        {currentWeekStart.toLocaleDateString()} – {endOfWeek.toLocaleDateString()}
      </h2>
      <div className="flex space-x-2">
        <button onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
          ← Previous
        </button>
        <button onClick={onToday} className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm">
          Today
        </button>
        <button onClick={onNext} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
          Next →
        </button>
      </div>
    </div>
  );
};


// 'use client';

// import React from 'react';

// type Props = {
//   currentWeekStart: Date;
//   onPrev: () => void;
//   onNext: () => void;
//   onToday: () => void;
// };

// export const CalendarHeader = ({ currentWeekStart, onPrev, onNext, onToday }: Props) => {
//   const endOfWeek = new Date(currentWeekStart);
//   endOfWeek.setDate(endOfWeek.getDate() + 6);

//   return (
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-xl font-semibold text-gray-800">
//         {currentWeekStart.toLocaleDateString()} – {endOfWeek.toLocaleDateString()}
//       </h2>
//       <div className="space-x-2">
//         <button onClick={onPrev} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
//           ← Previous
//         </button>
//         <button onClick={onToday} className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-sm">
//           Today
//         </button>
//         <button onClick={onNext} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// };
