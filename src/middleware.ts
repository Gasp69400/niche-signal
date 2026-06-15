import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { copyCookies, updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/auth/callback") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionResponse = await updateSession(request);

  if (pathname.startsWith("/api")) {
    return sessionResponse;
  }

  const pathnameLocale = pathname.split("/")[1];
  if (isValidLocale(pathnameLocale)) {
    sessionResponse.cookies.set("locale", pathnameLocale, {
      path: "/",
      maxAge: 31536000,
    });
    return sessionResponse;
  }

  const cookieLocale = request.cookies.get("locale")?.value;
  const acceptLang = request.headers.get("accept-language") ?? "";
  const browserLocale = acceptLang.toLowerCase().startsWith("fr") ? "fr" : defaultLocale;
  const locale = isValidLocale(cookieLocale ?? "") ? cookieLocale : browserLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const redirectResponse = NextResponse.redirect(url);
  copyCookies(sessionResponse, redirectResponse);
  return redirectResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
