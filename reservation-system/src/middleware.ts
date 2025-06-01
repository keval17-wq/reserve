import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'cookie';

// ✅ Hardcoded credentials (as per your request)
const supabaseUrl = 'https://xvowgjzaejkqibheqbay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b3dnanphZWprcWliaGVxYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTU5NjUsImV4cCI6MjA2MTY5MTk2NX0.5aB1CtFDJah7rHd6BxzsAN_S_UmVPvccOWztYO2Rj9U';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 🔍 Read Supabase access token from cookies
  const cookieHeader = req.headers.get('cookie') || '';
  const { 'sb-access-token': token } = parse(cookieHeader);

  // 🧠 If there's no token at all, redirect to login early
  if (!token) {
    const isPublic = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup';
    if (!isPublic) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // 🧪 Validate token by fetching user
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup';

  // 🔒 Not signed in & trying to access protected pages
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 🔁 Logged in & trying to access /login or /signup
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/calendar/:path*',
    '/tables/:path*',
    '/customers/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
};


// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import { parse } from 'cookie';

// const supabaseUrl = 'https://xvowgjzaejkqibheqbay.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b3dnanphZWprcWliaGVxYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTU5NjUsImV4cCI6MjA2MTY5MTk2NX0.5aB1CtFDJah7rHd6BxzsAN_S_UmVPvccOWztYO2Rj9U'; 

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   // Grab the Supabase access token from cookies
//   const cookieHeader = req.headers.get('cookie') || '';
//   const { 'sb-access-token': token } = parse(cookieHeader);

//   // Create Supabase client instance
//   const supabase = createClient(supabaseUrl, supabaseAnonKey);
//   const {
//     data: { user },
//   } = await supabase.auth.getUser(token);

//   const url = req.nextUrl;
//   const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';

//   // 🔒 If not signed in and visiting a protected page
//   if (!user && !isAuthPage && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // ✅ If signed in and trying to access signin/signup again
//   if (user && isAuthPage) {
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/calendar/:path*',
//     '/tables/:path*',
//     '/customers/:path*',
//     '/analytics/:path*',
//     '/settings/:path*',
//     '/login',
//     '/signup',
//   ],
// };
