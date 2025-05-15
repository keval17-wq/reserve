'use client';

import React, { useEffect, useState } from 'react';
import { getAllCustomers } from '@/lib/supabase/customers';
import CustomerTable from '@/components/customers/customerTable';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomers();
      setCustomers(data);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold">Customers</h1>
      <CustomerTable customers={customers} />
    </div>
  );
}
