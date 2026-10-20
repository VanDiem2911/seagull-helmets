import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Every public URL lives under /vi or /en. Anything else gets redirected to the visitor's last chosen language (default: Vietnamese).
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (/^\/(vi|en)(\/|$)/.test(pathname)) return NextResponse.next();

  const saved = request.cookies.get('sg_locale')?.value;
  const locale = saved === 'en' ? 'en' : 'vi';
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // skip API, Next internals, and anything with a file extension (images, icons, sitemap.xml, robots.txt…)
  matcher: ['/((?!api|_next|images|.*\\..*).*)'],
};
