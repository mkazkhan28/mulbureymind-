import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { PROTECTED_FILES, isProtectedPath } from "@/lib/files";

export async function middleware(request: NextRequest) {
  // Study files live in the private bucket: never serve a public copy, send it through the login check.
  const path = request.nextUrl.pathname;
  if (PROTECTED_FILES && isProtectedPath(path)) {
    return NextResponse.redirect(new URL(`/api/files${path}`, request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
