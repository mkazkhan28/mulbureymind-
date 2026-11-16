/**
 * Who may see what (test run: approved emails only).
 *
 * Open to everyone: the home page (hero only), subject pages, login/signup and the legal pages.
 * Everything else needs a signed-in account with access: an admin, or an email on the
 * public.approved_emails list (see supabase/access.sql). Later this becomes subscription-based.
 *
 * Gating only switches on when Supabase is configured, so local development keeps working.
 */
export const GATED = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const OPEN_PATHS = new Set(["/", "/login", "/signup", "/forgot-password", "/subjects", "/about", "/privacy", "/terms", "/contact", "/pending"]);

export function isOpenPath(path: string) {
  if (OPEN_PATHS.has(path)) return true;
  if (/^\/subjects\/[^/]+\/?$/.test(path)) return true; // a subject's overview page
  if (path.startsWith("/api/")) return true; // API routes check access themselves
  if (/\.[a-z0-9]+$/i.test(path)) return true; // static files (icons, worker, robots.txt…)
  return false;
}
