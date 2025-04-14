"use client";

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar's CSS

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const reservations = {
        '2025-04-11': ['Table 1 - 6:00 PM', 'Table 2 - 7:30 PM'],
        '2025-04-12': ['Table 3 - 5:00 PM'],
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Calendar</h1>
            <p>Welcome to your restaurant management Calendar.</p>
           
           
        </div>
    );
};

export default CalendarPage;