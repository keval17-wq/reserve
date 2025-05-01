"use client";

import React from 'react';
import StatsCard from '@/components/stats-card';
import Chart from '@/components/chart';
import { DashboardStatsCard } from '../../components/dashboard/dashboardStatsCard';

const dummyData = [
    { name: 'Mon', revenue: 1200, occupancy: 40 },
    { name: 'Tue', revenue: 1500, occupancy: 50 },
    { name: 'Wed', revenue: 1700, occupancy: 60 },
    { name: 'Thu', revenue: 1300, occupancy: 45 },
    { name: 'Fri', revenue: 2000, occupancy: 80 },
    { name: 'Sat', revenue: 2500, occupancy: 90 },
    { name: 'Sun', revenue: 2200, occupancy: 70 },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Revenue" value="$12,400" percentage={15} color="bg-green-500" />
                <StatsCard title="Reservations" value="320" percentage={5} color="bg-blue-500" />
                <StatsCard title="Occupancy Rate" value="75%" percentage={10} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Chart title="Revenue Over Time" data={dummyData} dataKey="revenue" />
                <Chart title="Occupancy Rate Over Time" data={dummyData} dataKey="occupancy" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardStatsCard 
                    title="Customer Growth" 
                    value="150" 
                    percentageChange={20} 
                    icon="user-group" 
                />
            </div>
        </div>
    );
};

export default Dashboard;
