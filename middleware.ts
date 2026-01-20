import { NextResponse, NextRequest } from 'next/server'

const AUTH_COOKIE = 'ahu_auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow static assets and the unlock page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/unlock') ||
    pathname.startsWith('/api/unlock') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get(AUTH_COOKIE)?.value
  if (cookie === '1') {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = '/unlock'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

