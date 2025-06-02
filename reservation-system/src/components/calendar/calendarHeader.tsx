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

export const CalendarHeader = ({ currentWeekStart, onPrev, onNext, onToday, view, setView }: Props) => {
  const formattedWeek = `${currentWeekStart.toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric',
  })} - ${new Date(currentWeekStart.getTime() + 6 * 86400000).toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric',
  })}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex gap-2">
        <button onClick={onPrev} className="btn">← Prev</button>
        <button onClick={onToday} className="btn">Today</button>
        <button onClick={onNext} className="btn">Next →</button>
      </div>
      <div className="text-lg font-medium">{formattedWeek}</div>
      <div className="flex gap-2">
        
        <button
          className={`btn ${view === 'week' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setView('week')}
        >
          Week View
        </button>
      </div>
    </div>
  );
};
