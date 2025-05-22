'use client';

import './globals.css';
import Sidebar from '@/components/sidebar';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md: breakpoint
    };

    handleResize(); // Run on mount
    window.addEventListener('resize', handleResize); // Listen to resize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Reservo",
    url: "https://reservo-symphony.vercel.app",
    description:
      "A modern web-based reservation system for restaurants with real-time analytics and table management.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
  };

  // Main content margin logic
  const mainMargin = isMobile ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64';

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-black`}>
        <div className="flex">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main
            className={`flex-1 min-h-screen p-6 bg-gray-100 transition-all duration-300 ${mainMargin}`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}



// import './globals.css';
// import Sidebar from '@/components/sidebar';
// import { Inter } from 'next/font/google';
// import type { Metadata } from 'next';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Reservo — Restaurant Reservation System',
//   description:
//     'A modern reservation dashboard for restaurants. Built with Next.js, Supabase, Tailwind, and Recharts.',
//   robots: {
//     index: true,
//     follow: true,
//   },
//   openGraph: {
//     title: 'Reservo – Restaurant Reservation System',
//     description: 'Manage reservations, tables, and analytics in one place.',
//     url: 'https://reservo-symphony.vercel.app',
//     siteName: 'Reservo',
//     locale: 'en_US',
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Reservo — Restaurant Reservation System',
//     description: 'Full-stack modern dashboard for restaurants.',
//     creator: '@reservosystem',
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebApplication",
//     name: "Reservo",
//     url: "https://reservo-symphony.vercel.app",
//     description:
//       "A modern web-based reservation system for restaurants with real-time analytics and table management.",
//     applicationCategory: "BusinessApplication",
//     operatingSystem: "All",
//   };

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
//           <Sidebar />
//           <main className="flex-1 min-h-screen pl-64 p-6 bg-gray-100">
//             {children}
//           </main>
//         </div>
//       </body>
//     </html>
//   );
// }
