"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Account = { signedIn: boolean; isAdmin: boolean; hasAccess: boolean; email?: string };

/** The signed-in person and what they may use (null while loading). */
export function useAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => {
    const supabase = createClient();
    let alive = true;
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (alive) setAccount({ signedIn: false, isAdmin: false, hasAccess: false });
        return;
      }
      const [{ data: profile }, { data: access }] = await Promise.all([
        supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
        supabase.rpc("has_access"),
      ]);
      const isAdmin = profile?.role === "admin";
      if (alive) setAccount({ signedIn: true, isAdmin, hasAccess: isAdmin || access === true, email: user.email });
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return account;
}

export async function signOut() {
  await createClient().auth.signOut();
  window.location.href = "/";
}
