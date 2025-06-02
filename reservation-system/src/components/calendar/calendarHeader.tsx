'use client';
import React from 'react';

interface Props {
  currentWeekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: 'day' | 'week';
  setView: (view: 'day' | 'week') => void;
}

export const CalendarHeader = ({
  currentWeekStart,
  onPrev,
  onNext,
  onToday,
  view,
  setView,
}: Props) => {
  const weekStartLabel = currentWeekStart.toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric',
  });

  const weekEndLabel = new Date(currentWeekStart.getTime() + 6 * 86400000).toLocaleDateString(
    'en-AU',
    {
      month: 'short',
      day: 'numeric',
    }
  );

  const formattedWeek = `${weekStartLabel} - ${weekEndLabel}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border bg-gray-50 shadow-sm">
      {/* Navigation Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onPrev}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          ← Prev
        </button>
        <button
          onClick={onToday}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition"
        >
          Today
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          Next →
        </button>
      </div>

      {/* Current Week Label */}
      <div className="text-center text-lg sm:text-xl font-semibold text-gray-800">{formattedWeek}</div>

      {/* View Switcher */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setView('day')}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition ${
            view === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Day View
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition ${
            view === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Week View
        </button>
      </div>
    </div>
  );
};


// 'use client';
// import React from 'react';

// interface Props {
//   currentWeekStart: Date;
//   onPrev: () => void;
//   onNext: () => void;
//   onToday: () => void;
//   view: 'day' | 'week';
//   setView: (view: 'day' | 'week') => void;
// }

// export const CalendarHeader = ({ currentWeekStart, onPrev, onNext, onToday, view, setView }: Props) => {
//   const formattedWeek = `${currentWeekStart.toLocaleDateString('en-AU', {
//     month: 'short',
//     day: 'numeric',
//   })} - ${new Date(currentWeekStart.getTime() + 6 * 86400000).toLocaleDateString('en-AU', {
//     month: 'short',
//     day: 'numeric',
//   })}`;

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//       <div className="flex gap-2">
//         <button onClick={onPrev} className="btn">← Prev</button>
//         <button onClick={onToday} className="btn">Today</button>
//         <button onClick={onNext} className="btn">Next →</button>
//       </div>
//       <div className="text-lg font-medium">{formattedWeek}</div>
//       <div className="flex gap-2">
        
//         <button
//           className={`btn ${view === 'week' ? 'bg-blue-600 text-white' : ''}`}
//           onClick={() => setView('week')}
//         >
//           Week View
//         </button>
//       </div>
//     </div>
//   );
// };
