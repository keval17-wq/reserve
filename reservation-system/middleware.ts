import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'cookie';

const supabaseUrl = 'https://xvowgjzaejkqibheqbay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b3dnanphZWprcWliaGVxYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTU5NjUsImV4cCI6MjA2MTY5MTk2NX0.5aB1CtFDJah7rHd6BxzsAN_S_UmVPvccOWztYO2Rj9U'; // shortened for brevity

export async function middleware(req: NextRequest) {
  const token = parse(req.headers.get('cookie') || '')['sb-access-token'];

  const supabase = createClient(supabaseUrl, supabaseKey);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard');

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/calendar/:path*', '/tables/:path*'],
};
