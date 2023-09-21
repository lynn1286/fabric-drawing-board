import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export default function middleware(request: NextRequest) {
  const _middleware = createMiddleware({
    locales: ['zh-cn', 'en'],
    defaultLocale: 'zh-cn',
    localePrefix: 'always',
  });
  const response = _middleware(request);

  return response;
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
