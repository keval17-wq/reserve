'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { BsTable, BsGraphUp } from 'react-icons/bs';
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from 'react-icons/hi';

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} />, color: 'from-purple-100 to-purple-200' },
    { href: '/calendar', label: 'Calendar', icon: <FiCalendar size={20} />, color: 'from-sky-100 to-sky-200' },
    { href: '/tables', label: 'Tables', icon: <BsTable size={20} />, color: 'from-amber-100 to-yellow-200' },
    { href: '/customers', label: 'Customers', icon: <FiUsers size={20} />, color: 'from-green-100 to-green-200' },
    { href: '/analytics', label: 'Analytics', icon: <BsGraphUp size={20} />, color: 'from-cyan-100 to-cyan-200' },
    { href: '/settings', label: 'Settings', icon: <FiSettings size={20} />, color: 'from-gray-100 to-gray-200' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block fixed top-0 left-0 h-screen z-40 bg-white text-slate-800 shadow-2xl border-r transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
              {!isCollapsed && (
                <h1 className="text-xl font-bold text-slate-800 tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  Reservo
                </h1>
              )}
              <button
                onClick={toggleSidebar}
                className="focus:outline-none text-slate-400 hover:text-slate-700 transition hover:scale-105"
              >
                {isCollapsed ? (
                  <HiOutlineChevronDoubleRight size={22} />
                ) : (
                  <HiOutlineChevronDoubleLeft size={22} />
                )}
              </button>
            </div>

            <nav className="mt-4 space-y-1">
              {links.map(({ href, label, icon, color }) => (
                <SidebarLink
                  key={href}
                  href={href}
                  icon={icon}
                  label={label}
                  isCollapsed={isCollapsed}
                  active={pathname === href}
                  color={color}
                />
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 flex items-center justify-between hover:bg-slate-100 cursor-pointer group border-t border-slate-100">
            <Link href="/logout" className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-800 transition">
              <FiLogOut size={20} />
              {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            </Link>
            {!isCollapsed && (
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-sky-400 text-white rounded-full text-sm font-semibold flex items-center justify-center shadow-sm">
                N
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-4 left-4 right-4 h-16 bg-white z-50 shadow-md rounded-xl px-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Reservo</h1>
        <button onClick={toggleMobileMenu} className="text-slate-600 hover:text-slate-800 transition">
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 bg-white shadow-lg rounded-xl z-40 p-4 space-y-2">
          {links.map(({ href, label, color }) => (
            <MobileLink key={href} href={href} label={label} active={pathname === href} color={color} />
          ))}
          <MobileLink href="/logout" label="Logout" active={pathname === '/logout'} />
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
  active: boolean;
  color: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  isCollapsed,
  active,
  color,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center mx-3 rounded-lg font-medium group transition-all duration-200 ${
        active
          ? `bg-gradient-to-r ${color} text-slate-900 shadow-inner`
          : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
      } ${!isCollapsed ? 'pl-4 pr-3 py-2' : 'justify-center p-3'}`}
    >
      <div className="group-hover:scale-110 transition-transform duration-200">{icon}</div>
      {!isCollapsed && <span className="ml-4 text-sm">{label}</span>}
    </Link>
  );
};

const MobileLink = ({
  href,
  label,
  active,
  color,
}: {
  href: string;
  label: string;
  active: boolean;
  color?: string;
}) => (
  <Link
    href={href}
    className={`block w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
      active
        ? `bg-gradient-to-r ${color} text-slate-900`
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {label}
  </Link>
);

export default Sidebar;


// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   FiHome,
//   FiCalendar,
//   FiUsers,
//   FiSettings,
//   FiLogOut,
//   FiMenu,
//   FiX,
// } from 'react-icons/fi';
// import { BsTable, BsGraphUp } from 'react-icons/bs';
// import {
//   HiOutlineChevronDoubleLeft,
//   HiOutlineChevronDoubleRight,
// } from 'react-icons/hi';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   const links = [
//     { href: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} />, color: 'from-purple-100 to-purple-200' },
//     { href: '/calendar', label: 'Calendar', icon: <FiCalendar size={20} />, color: 'from-sky-100 to-sky-200' },
//     { href: '/tables', label: 'Tables', icon: <BsTable size={20} />, color: 'from-amber-100 to-yellow-200' },
//     { href: '/customers', label: 'Customers', icon: <FiUsers size={20} />, color: 'from-green-100 to-green-200' },
//     { href: '/analytics', label: 'Analytics', icon: <BsGraphUp size={20} />, color: 'from-cyan-100 to-cyan-200' },
//     { href: '/settings', label: 'Settings', icon: <FiSettings size={20} />, color: 'from-gray-100 to-gray-200' },
//   ];

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div
//         className={`hidden md:block fixed top-0 left-0 h-screen z-40 bg-white text-slate-800 shadow-2xl border-r transition-all duration-300 ease-in-out ${
//           isCollapsed ? 'w-20' : 'w-64'
//         }`}
//       >
//         <div className="flex flex-col justify-between h-full">
//           {/* Header */}
//           <div>
//             <div className="flex items-center justify-between px-4 pt-5 pb-3">
//               {!isCollapsed && (
//                 <h1 className="text-xl font-bold text-slate-800 tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
//                   Reservo
//                 </h1>
//               )}
//               <button
//                 onClick={toggleSidebar}
//                 className="focus:outline-none text-slate-400 hover:text-slate-700 transition hover:scale-105"
//               >
//                 {isCollapsed ? (
//                   <HiOutlineChevronDoubleRight size={22} />
//                 ) : (
//                   <HiOutlineChevronDoubleLeft size={22} />
//                 )}
//               </button>
//             </div>

//             <nav className="mt-4 space-y-1">
//               {links.map(({ href, label, icon, color }) => (
//                 <SidebarLink
//                   key={href}
//                   href={href}
//                   icon={icon}
//                   label={label}
//                   isCollapsed={isCollapsed}
//                   active={pathname === href}
//                   color={color}
//                 />
//               ))}
//             </nav>
//           </div>

//           {/* Footer */}
//           <div className="p-4 flex items-center justify-between hover:bg-slate-100 cursor-pointer group border-t border-slate-100">
//             <Link href="/logout" className="flex items-center space-x-2 text-slate-500 group-hover:text-slate-800 transition">
//               <FiLogOut size={20} />
//               {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
//             </Link>
//             {!isCollapsed && (
//               <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-sky-400 text-white rounded-full text-sm font-semibold flex items-center justify-center shadow-sm">
//                 N
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navbar */}
//       <div className="md:hidden fixed top-4 left-4 right-4 h-16 bg-white z-50 shadow-md rounded-xl px-4 flex items-center justify-between">
//         <h1 className="text-lg font-bold text-slate-800 tracking-tight">Reservo</h1>
//         <button onClick={toggleMobileMenu} className="text-slate-600 hover:text-slate-800 transition">
//           {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
//         </button>
//       </div>

//       {mobileMenuOpen && (
//         <div className="md:hidden fixed top-20 left-4 right-4 bg-white shadow-lg rounded-xl z-40 p-4 space-y-2">
//           {links.map(({ href, label, color }) => (
//             <MobileLink key={href} href={href} label={label} active={pathname === href} color={color} />
//           ))}
//           <MobileLink href="/logout" label="Logout" active={pathname === '/logout'} />
//         </div>
//       )}
//     </>
//   );
// };

// interface SidebarLinkProps {
//   href: string;
//   icon: React.ReactNode;
//   label: string;
//   isCollapsed: boolean;
//   active: boolean;
//   color: string;
// }

// const SidebarLink: React.FC<SidebarLinkProps> = ({
//   href,
//   icon,
//   label,
//   isCollapsed,
//   active,
//   color,
// }) => {
//   return (
//     <Link
//       href={href}
//       className={`flex items-center mx-3 rounded-lg font-medium group transition-all duration-200 ${
//         active
//           ? `bg-gradient-to-r ${color} text-slate-900 shadow-inner`
//           : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
//       } ${!isCollapsed ? 'pl-4 pr-3 py-2' : 'justify-center p-3'}`}
//     >
//       <div className="group-hover:scale-110 transition-transform duration-200">{icon}</div>
//       {!isCollapsed && <span className="ml-4 text-sm">{label}</span>}
//     </Link>
//   );
// };

// const MobileLink = ({
//   href,
//   label,
//   active,
//   color,
// }: {
//   href: string;
//   label: string;
//   active: boolean;
//   color?: string;
// }) => (
//   <Link
//     href={href}
//     className={`block w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
//       active
//         ? `bg-gradient-to-r ${color} text-slate-900`
//         : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
//     }`}
//   >
//     {label}
//   </Link>
// );

// export default Sidebar;

