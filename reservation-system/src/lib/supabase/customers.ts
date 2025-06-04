// src/lib/supabase/customers.ts

import { supabase } from '@/lib/supabaseClient';

export type CustomerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

/**
 * Fetch all customers, most recent first.
 */
export async function getAllCustomers(): Promise<CustomerRow[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('id, full_name, email, phone, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as CustomerRow[];
}

/**
 * Add a new customer. Returns the new row’s email.
 */
export async function addCustomer(
  full_name: string,
  email: string,
  phone?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('customers')
    .insert({ full_name, email, phone })
    .select('email')
    .single();
  if (error) throw error;
  return (data as { email: string }).email;
}

/**
 * Create a customer if none exists with this email. Always returns the customer’s email.
 */
export async function createCustomerIfUnique(
  full_name: string,
  email: string,
  phone?: string
): Promise<string> {
  // Check if a customer with this email already exists
  const { data: existing, error: fetchErr } = await supabase
    .from('customers')
    .select('email')
    .eq('email', email)
    .single();

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    // If error is anything other than “no rows returned,” rethrow
    throw fetchErr;
  }

  if (existing && existing.email) {
    // Already exists; optionally update phone or name if needed
    return existing.email;
  }

  // Otherwise, insert new customer
  const { data, error: insertErr } = await supabase
    .from('customers')
    .insert({ full_name, email, phone })
    .select('email')
    .single();
  if (insertErr) throw insertErr;
  return (data as { email: string }).email;
}

/**
 * Delete a customer by id. This will cascade-delete their reservations.
 */
export async function deleteCustomerById(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}


// // src/lib/supabase/customers.ts

// import { supabase } from '@/lib/supabaseClient';

// export type CustomerRow = {
//   id: string;
//   full_name: string;
//   email: string;
//   phone: string | null;
//   created_at: string;
// };

// /**
//  * Fetch all customers, most recent first.
//  */
// export async function getAllCustomers(): Promise<CustomerRow[]> {
//   const { data, error } = await supabase
//     .from('customers')
//     .select('id, full_name, email, phone, created_at')
//     .order('created_at', { ascending: false });
//   if (error) throw error;
//   return (data || []) as CustomerRow[];
// }

// /**
//  * Add a new customer. Returns the new row’s id.
//  */
// export async function addCustomer(
//   full_name: string,
//   email: string,
//   phone?: string
// ): Promise<{ id: string }> {
//   const { data, error } = await supabase
//     .from('customers')
//     .insert({ full_name, email, phone })
//     .select('id')
//     .single();
//   if (error) throw error;
//   return data as { id: string };
// }

// /**
//  * Delete a customer by id. This will cascade‐delete their reservations (due to FOREIGN KEY).
//  */
// export async function deleteCustomerById(id: string): Promise<void> {
//   const { error } = await supabase
//     .from('customers')
//     .delete()
//     .eq('id', id);
//   if (error) throw error;
// }
