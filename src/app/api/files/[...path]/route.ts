import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { r2SignedUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

const LINK_SECONDS = 60 * 60; // signed links last one hour

/**
 * GET /api/files/files/<subject>/<file>.pdf  (or /api/files/data/qbank/<set>.json)
 * Logged-in visitors are redirected to a short-lived signed link in the private Cloudflare R2 bucket.
 * Everyone else is sent to the login page (or gets 401 when the file is fetched by the reader).
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const key = params.path.join("/");
  if (!/^(files|data)\/[A-Za-z0-9._\-/]+$/.test(key) || key.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (request.headers.get("sec-fetch-mode") === "navigate") {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.json({ error: "Please log in to open this file." }, { status: 401 });
  }

  const { data: access } = await supabase.rpc("has_access");
  if (access !== true) {
    if (request.headers.get("sec-fetch-mode") === "navigate") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
    return NextResponse.json({ error: "Your account is waiting for approval." }, { status: 403 });
  }

  const signed = r2SignedUrl(key, LINK_SECONDS);
  if (!signed) {
    return NextResponse.json({ error: "File storage is not configured." }, { status: 500 });
  }

  const res = NextResponse.redirect(signed, 302);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
