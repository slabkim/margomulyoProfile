import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest, requestHeaders = new Headers(request.headers)) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  // The login screen must remain available when Supabase is temporarily
  // unreachable. Authentication is performed by the login Server Action.
  if (isLoginRoute) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  let hasClaims = false;
  try {
    const { data } = await supabase.auth.getClaims();
    hasClaims = Boolean(data?.claims);
  } catch {
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '?error=service-unavailable';
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (isAdminRoute && !hasClaims) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return response;
}
