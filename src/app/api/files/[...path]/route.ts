import { NextResponse, type NextRequest } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BUCKET = "study-files";
const LINK_SECONDS = 60 * 60; // signed links last one hour

/**
 * GET /api/files/files/<subject>/<file>.pdf  (or /api/files/data/qbank/<set>.json)
 * Logged-in visitors are redirected to a short-lived signed link in the private bucket.
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "File storage is not configured." }, { status: 500 });
  }

  const admin = createAdminClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.storage.from(BUCKET).createSignedUrl(key, LINK_SECONDS);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const res = NextResponse.redirect(data.signedUrl, 302);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
