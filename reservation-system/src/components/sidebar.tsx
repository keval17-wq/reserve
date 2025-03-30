import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-8">Reservation System</h1>
            <nav className="flex-1 space-y-4">
                <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
                <Link href="/calendar" className="block p-2 hover:bg-gray-700 rounded">Calendar</Link>
                <Link href="/tables" className="block p-2 hover:bg-gray-700 rounded">Tables</Link>
                <Link href="/reservations" className="block p-2 hover:bg-gray-700 rounded">Customer</Link>
                <Link href="/customers" className="block p-2 hover:bg-gray-700 rounded">Analytics</Link>
            </nav>
        </div>
    );
}

export default Sidebar;
