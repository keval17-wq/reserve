// ✅ lib/supabase/customers.ts
import { supabase } from '@/lib/supabaseClient';

// ✅ Get all customers (legacy function)
export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('id, name, email');

  if (error) throw new Error(error.message);
  return data ?? [];
};

// ✅ Get one customer by ID
export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ✅ Create a new customer if email is unique
export const createCustomerIfUnique = async (name: string, email: string): Promise<string> => {
  const { data: existing, error: checkError } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single();

  if (checkError && checkError.code !== 'PGRST116') throw checkError; // 'PGRST116' = no rows returned

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from('customers')
    .insert({ name, email })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data.id;
};
