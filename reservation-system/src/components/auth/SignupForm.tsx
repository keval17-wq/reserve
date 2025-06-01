'use client';
import { useState } from 'react';
import { signUp } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';

export const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    const { error } = await signUp(email, password);
    if (!error) router.push('/dashboard');
    else alert(error.message);
  };

  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};
