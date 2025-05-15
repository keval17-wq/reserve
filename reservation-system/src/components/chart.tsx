import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
    name: string;
    [key: string]: number | string;
}

interface ChartProps {
    data: ChartData[];
    dataKey: string;
    title: string;
}

const Chart: React.FC<ChartProps> = ({ data, dataKey, title }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
