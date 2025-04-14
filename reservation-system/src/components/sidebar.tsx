"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiCalendar, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { BsTable, BsGraphUp } from 'react-icons/bs';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`h-screen bg-slate-100 text-slate-800 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-500 flex flex-col justify-between shadow-lg border-r border-slate-300`}>
            {/* Header */}
            <div>
                <div className="flex items-center justify-between p-4 group">
                    {!isCollapsed && <h1 className="text-xl font-bold text-slate-700 transition duration-300">Reservo</h1>}
                    <button 
                        onClick={toggleSidebar} 
                        className="focus:outline-none text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-all duration-300 hover:scale-110"
                    >
                        {isCollapsed ? (
                            <HiOutlineChevronDoubleRight size={22} className="hover:text-slate-800" />
                        ) : (
                            <HiOutlineChevronDoubleLeft size={22} className="hover:text-slate-800" />
                        )}
                    </button>
                </div>
                {/* Navigation Links */}
                <nav className="mt-8 space-y-1">
                    <SidebarLink href="/dashboard" icon={<FiHome size={20} />} label="Dashboard" isCollapsed={isCollapsed} />
                    <SidebarLink href="/calendar" icon={<FiCalendar size={20} />} label="Calendar" isCollapsed={isCollapsed} />
                    <SidebarLink href="/tables" icon={<BsTable size={20} />} label="Tables" isCollapsed={isCollapsed} />
                    <SidebarLink href="/customers" icon={<FiUsers size={20} />} label="Customers" isCollapsed={isCollapsed} />
                    <SidebarLink href="/analytics" icon={<BsGraphUp size={20} />} label="Analytics" isCollapsed={isCollapsed} />
                    <SidebarLink href="/settings" icon={<FiSettings size={20} />} label="Settings" isCollapsed={isCollapsed} />
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-200 transition duration-300 cursor-pointer">
                <Link href="/logout" className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors">
                    <FiLogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </Link>
                {!isCollapsed && (
                    <div className="flex items-center justify-center w-10 h-10 bg-slate-400 text-white rounded-full text-sm font-bold transition-transform duration-300 hover:scale-105">
                        N
                    </div>
                )}
            </div>
        </div>
    );
};

interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label, isCollapsed }) => {
    return (
        <Link 
            href={href} 
            className="flex items-center p-2 mx-2 rounded text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all duration-300 hover:pl-4"
        >
            {icon}
            {!isCollapsed && <span className="ml-4 transition-transform duration-300">{label}</span>}
        </Link>
    );
};

export default Sidebar;
