"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import BookReader from "@/components/BookReader";
import { BOOKS_DATA } from "@/lib/books";
import { findStudyFile, getSubjectStructure } from "@/lib/subject-structure";

export default function ReadPage() {
  const params = useParams();
  const id = params?.bookId as string;

  // 1. A textbook
  const book = BOOKS_DATA.find((b) => b.id === id);
  if (book) return <BookReader book={book} />;

  // 2. A lecture / course-outline PDF from a subject section
  const found = findStudyFile(id);
  if (found?.file.pdf) {
    const { file, subjectSlug } = found;
    const structure = getSubjectStructure(subjectSlug);
    const area = structure?.areas.find((a) => a.slug === file.area);
    const backHref = `/subjects/${subjectSlug}${area ? `/${area.slug}` : ""}`;
    return (
      <BookReader
        book={{
          id: file.id,
          title: file.title,
          edition: [area?.title, file.topic].filter(Boolean).join(" · ") || "Lecture slides",
          authors: file.by ?? "Lecture slides",
          driveId: "",
          pdfUrl: file.pdf,
        }}
        backHref={backHref}
        backLabel={`Back to ${area?.title ?? structure?.shortName ?? "subject"}`}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="max-w-sm rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
        <h1 className="text-lg font-semibold text-ink">Not found</h1>
        <p className="mt-2 text-sm text-slate-400">This book or lecture isn&apos;t in the library.</p>
        <Link href="/books" className="btn-ghost mt-5">
          Back to textbooks
        </Link>
      </div>
    </div>
  );
}
