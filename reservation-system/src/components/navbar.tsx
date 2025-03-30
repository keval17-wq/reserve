import React from 'react';

const Navbar = () => {
    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-sm text-gray-500">Welcome to your restaurant management dashboard.</p>
            </div>
            <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Refresh Data</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">New Reservation</button>
                <span>kevalgandhi12e@gmail.com</span>
            </div>
        </div>
    );
};

export default Navbar;
