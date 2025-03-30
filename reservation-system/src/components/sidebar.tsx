"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiCalendar, FiUsers, FiPieChart, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`h-screen bg-gray-900 text-white ${isCollapsed ? 'w-20' : 'w-64'} transition-width duration-300`}>
            <div className="flex items-center justify-between p-4">
                {!isCollapsed && <h1 className="text-xl font-bold">Reservo</h1>}
                <button onClick={toggleSidebar} className="focus:outline-none">
                    {isCollapsed ? '➡️' : '⬅️'}
                </button>
            </div>
            <nav className="flex-1 space-y-4 mt-8">
                <Link href="/dashboard" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiHome />
                    {!isCollapsed && <span>Dashboard</span>}
                </Link>
                <Link href="/calendar" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiCalendar />
                    {!isCollapsed && <span>Calendar</span>}
                </Link>
                <Link href="/tables" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiUsers />
                    {!isCollapsed && <span>Tables</span>}
                </Link>
                <Link href="/customers" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiUsers />
                    {!isCollapsed && <span>Customers</span>}
                </Link>
                <Link href="/analytics" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiPieChart />
                    {!isCollapsed && <span>Analytics</span>}
                </Link>
            </nav>
            <div className="p-4 space-y-4">
                <Link href="/settings" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiSettings />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
                <Link href="/logout" className="block p-2 flex items-center space-x-2 hover:bg-gray-700 rounded">
                    <FiLogOut />
                    {!isCollapsed && <span>Logout</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
