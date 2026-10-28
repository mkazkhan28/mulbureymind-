"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import BookReader from "@/components/BookReader";
import { BOOKS_DATA } from "@/lib/books";

export default function ReadBookPage() {
  const params = useParams();
  const book = BOOKS_DATA.find((b) => b.id === params?.bookId);

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
        <div className="max-w-sm rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
          <h1 className="text-lg font-semibold text-ink">Book not found</h1>
          <p className="mt-2 text-sm text-slate-400">This book isn&apos;t in the library.</p>
          <Link href="/books" className="btn-ghost mt-5">
            Back to textbooks
          </Link>
        </div>
      </div>
    );
  }
  return <BookReader book={book} />;
}
