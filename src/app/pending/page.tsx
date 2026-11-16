"use client";

import Link from "next/link";
import { Clock, LogOut } from "lucide-react";
import { signOut, useAccount } from "@/lib/useAccount";

/** Shown to signed-in accounts that haven't been approved yet (test run). */
export default function PendingPage() {
  const account = useAccount();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-soft text-primary">
        <Clock className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
        {account?.signedIn ? "Your account is waiting for approval" : "Log in to continue"}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-400">
        {account?.signedIn ? (
          <>
            Molar Hub is in a small test run right now. You&apos;re signed in
            {account.email ? (
              <>
                {" "}
                as <span className="font-semibold text-ink">{account.email}</span>
              </>
            ) : null}
            . Once the admin approves this email, every subject, lecture and question will open for you.
          </>
        ) : (
          <>Lectures, questions and the rest of Molar Hub are for approved members.</>
        )}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/subjects" className="btn-secondary !px-6">
          Browse subjects
        </Link>
        {account?.signedIn ? (
          <button onClick={signOut} className="btn-secondary !px-6">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        ) : (
          <Link href="/login" className="btn-primary !px-6">
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
