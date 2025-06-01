import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'cookie';

const supabaseUrl = 'https://xvowgjzaejkqibheqbay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b3dnanphZWprcWliaGVxYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTU5NjUsImV4cCI6MjA2MTY5MTk2NX0.5aB1CtFDJah7rHd6BxzsAN_S_UmVPvccOWztYO2Rj9U'; // your full key

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const cookieHeader = req.headers.get('cookie') || '';
  const { 'sb-access-token': token } = parse(cookieHeader);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  const url = req.nextUrl;
  const isAuthPage = url.pathname === '/signin' || url.pathname === '/signup';

  // ✅ If not signed in and trying to access protected routes
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // ✅ If signed in and trying to access signin or signup page
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Match everything except _next and static assets
export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
