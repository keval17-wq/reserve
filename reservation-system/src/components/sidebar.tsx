"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiCalendar, FiUsers, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { BsTable, BsGraphUp } from 'react-icons/bs';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-screen z-40 bg-slate-100 text-slate-800 shadow-lg border-r border-slate-300 transition-all duration-500 ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between p-4">
              {!isCollapsed && <h1 className="text-xl font-bold text-slate-700">Reservo</h1>}
              <button
                onClick={toggleSidebar}
                className="focus:outline-none text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-all hover:scale-110"
              >
                {isCollapsed ? (
                  <HiOutlineChevronDoubleRight size={22} className="hover:text-slate-800" />
                ) : (
                  <HiOutlineChevronDoubleLeft size={22} className="hover:text-slate-800" />
                )}
              </button>
            </div>

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
          <div className="p-4 flex items-center justify-between hover:bg-slate-200 cursor-pointer">
            <Link href="/logout" className="flex items-center space-x-2 text-slate-500 hover:text-slate-800">
              <FiLogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </Link>
            {!isCollapsed && (
              <div className="w-10 h-10 bg-slate-400 text-white rounded-full text-sm font-bold flex items-center justify-center">
                N
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-4 left-4 right-4 h-16 bg-slate-100 z-50 shadow flex items-center justify-between px-4 rounded-xl">
        <h1 className="text-lg font-bold text-slate-700">Reservo</h1>
        <button onClick={toggleMobileMenu} className="text-slate-600">
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-slate-100 shadow-lg z-40 py-4 space-y-2">
          <MobileLink href="/dashboard" label="Dashboard" />
          <MobileLink href="/calendar" label="Calendar" />
          <MobileLink href="/tables" label="Tables" />
          <MobileLink href="/customers" label="Customers" />
          <MobileLink href="/analytics" label="Analytics" />
          <MobileLink href="/settings" label="Settings" />
          <MobileLink href="/logout" label="Logout" />
        </div>
      )}
    </>
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
      {!isCollapsed && <span className="ml-4">{label}</span>}
    </Link>
  );
};

const MobileLink = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="block px-4 py-2 text-slate-700 hover:bg-slate-200">
    {label}
  </Link>
);

export default Sidebar;
