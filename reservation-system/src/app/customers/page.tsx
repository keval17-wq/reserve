// src/app/customers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import {
  getAllCustomers,
  addCustomer,
  deleteCustomerById,
  CustomerRow,
} from '@/lib/supabase/customers';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');

  // 1) Load all customers on mount and after changes
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // 2) Handle adding a new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      alert('Name and Email are required.');
      return;
    }
    try {
      await addCustomer(newName, newEmail, newPhone || undefined);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      loadCustomers();
    } catch (err) {
      console.error('Error adding customer:', err);
      alert('Failed to add customer. Maybe email already exists?');
    }
  };

  // 3) Handle deleting a customer
  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Delete this customer (and their reservations)?')) return;
    try {
      await deleteCustomerById(id);
      loadCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer.');
    }
  };

  return (
    <div className="bg-white text-black min-h-screen p-8 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold">Customers</h1>

      {/* Add New Customer Form */}
      <section className="p-6 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="mt-1 border rounded-lg px-3 py-2 w-full"
                placeholder="123-456-7890"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Customer
          </button>
        </form>
      </section>

      {/* List of Customers */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Customers</h2>
        {loading ? (
          <p className="text-gray-500">Loading customers…</p>
        ) : customers.length === 0 ? (
          <p className="text-gray-500">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Joined On
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800">{c.full_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{c.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{c.phone ?? '—'}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {format(new Date(c.created_at), 'MM/dd/yyyy')}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
