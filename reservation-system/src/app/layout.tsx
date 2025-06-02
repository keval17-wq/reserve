'use client';

import './globals.css';
import Sidebar from '@/components/sidebar';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // ✅ Supabase client setup
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ JSON-LD schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Reservo",
    url: "https://reserve-two.vercel.app",
    description:
      "A modern web-based reservation system for restaurants with real-time analytics and table management.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
  };

  // ✅ Hide sidebar on login/signup pages
  const hideSidebar = pathname === '/login' || pathname === '/signup';
  const mainMargin = hideSidebar
    ? 'ml-0'
    : isMobile
    ? 'ml-0'
    : isCollapsed
    ? 'ml-20'
    : 'ml-64';

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-black`}>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <div className="flex">
            {!hideSidebar && (
              <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            )}
            <main
              className={`flex-1 min-h-screen p-6 bg-gray-100 transition-all duration-300 ${mainMargin}`}
            >
              {children}
            </main>
          </div>
        </SessionContextProvider>
      </body>
    </html>
  );
}



// 'use client';

// import './globals.css';
// import Sidebar from '@/components/sidebar';
// import { Inter } from 'next/font/google';
// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebApplication",
//     name: "Reservo",
//     url: "https://reserve-two.vercel.app",
//     description:
//       "A modern web-based reservation system for restaurants with real-time analytics and table management.",
//     applicationCategory: "BusinessApplication",
//     operatingSystem: "All",
//   };

//   // Hide sidebar on auth pages
//   const hideSidebar = pathname === '/login' || pathname === '/signup';
//   const mainMargin = hideSidebar ? 'ml-0' : isMobile ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64';

//   return (
//     <html lang="en">
//       <head>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//         />
//       </head>
//       <body className={`${inter.className} bg-white text-black`}>
//         <div className="flex">
//           {!hideSidebar && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
//           <main
//             className={`flex-1 min-h-screen p-6 bg-gray-100 transition-all duration-300 ${mainMargin}`}
//           >
//             {children}
//           </main>
//         </div>
//       </body>
//     </html>
//   );
// }

