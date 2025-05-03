import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    percentage?: number;
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, percentage, color = 'bg-blue-500' }) => {
    return (
        <div className={`p-4 rounded-lg shadow-lg ${color} text-white transition-transform duration-300 hover:scale-105`}>
            <h2 className="text-sm font-medium uppercase">{title}</h2>
            <div className="mt-2 text-3xl font-bold">{value}</div>
            {percentage !== undefined && (
                <div className="mt-1 text-sm">
                    {percentage > 0 ? `⬆️ ${percentage}%` : `⬇️ ${percentage}%`}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
