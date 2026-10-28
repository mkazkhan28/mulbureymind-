import { BOOKS_DATA } from "@/lib/books";

/**
 * Streams a textbook PDF from Google Drive through this site, so the in-site reader
 * (PDF.js) can load it without cross-origin errors and students can highlight and take notes.
 * The Drive file must be shared as "Anyone with the link → Viewer".
 */
export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const book = BOOKS_DATA.find((b) => b.id === params.id);
  if (!book) return Response.json({ error: "Book not found" }, { status: 404 });
  if (!book.driveId || book.driveId.startsWith("PASTE_")) {
    return Response.json({ error: "This book's PDF hasn't been uploaded yet." }, { status: 404 });
  }

  // confirm=t skips Google's "can't scan this file for viruses" page for large files
  const url = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(book.driveId)}&export=download&confirm=t`;
  const headers: Record<string, string> = {};
  const range = request.headers.get("range");
  if (range) headers.range = range;

  const upstream = await fetch(url, { headers, redirect: "follow" });
  const type = upstream.headers.get("content-type") ?? "";

  if (!upstream.ok || type.includes("text/html")) {
    return Response.json(
      {
        error:
          "Google Drive didn't return the PDF. Check that the file is shared as \"Anyone with the link\". " +
          "If it was just downloaded many times, Google may be limiting it for a few hours.",
      },
      { status: 502 }
    );
  }

  const out = new Headers({
    "content-type": "application/pdf",
    "cache-control": "public, max-age=86400, s-maxage=604800",
    "accept-ranges": upstream.headers.get("accept-ranges") ?? "bytes",
  });
  for (const h of ["content-length", "content-range"]) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
