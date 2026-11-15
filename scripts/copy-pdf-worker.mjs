// Copies PDF.js's worker into /public so the reader loads it as a plain static file.
// (Bundling it made Next.js minify it a second time, which breaks the build.)
// Runs automatically before `next dev` and `next build`.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const src = require.resolve("pdfjs-dist/build/pdf.worker.min.mjs");
mkdirSync("public", { recursive: true });
copyFileSync(src, "public/pdf.worker.min.mjs");
console.log("Copied PDF.js worker to public/pdf.worker.min.mjs");
