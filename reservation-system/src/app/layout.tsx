import './globals.css';
import Sidebar from '@/components/sidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Reservation System',
  description: 'Restaurant Reservation System built with Next.js, Tailwind CSS, Supabase, and Recharts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
