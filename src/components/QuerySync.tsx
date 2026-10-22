"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reads URL query params (e.g. /practice?subject=anat) and hands them to the page,
 * so sidebar links can open a page pre-filtered to a subject.
 * Render inside <Suspense> (required by Next.js for useSearchParams).
 */
export default function QuerySync({ onParams }: { onParams: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onParams(new URLSearchParams(searchParams.toString()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return null;
}
