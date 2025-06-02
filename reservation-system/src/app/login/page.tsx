'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleLogin} className="bg-gray-100 p-8 rounded shadow-md space-y-4 w-96">
        <h1 className="text-xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  );
}
