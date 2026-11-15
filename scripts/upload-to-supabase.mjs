// Uploads the study files (public/files, except slide thumbnails, and public/data) into the
// private Supabase Storage bucket "study-files", keeping the same paths, e.g.
//   public/files/physiology/renal/01-x.pdf -> study-files/files/physiology/renal/01-x.pdf
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Safe to run again: existing files are replaced.
import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const BUCKET = "study-files";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const { data: bucket } = await sb.storage.getBucket(BUCKET);
if (!bucket) {
  const { error } = await sb.storage.createBucket(BUCKET, { public: false, fileSizeLimit: "50MB" });
  if (error) throw error;
  console.log(`Created private bucket "${BUCKET}"`);
} else if (bucket.public) {
  await sb.storage.updateBucket(BUCKET, { public: false });
  console.log(`Made bucket "${BUCKET}" private`);
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const jobs = [];
for (const [dir, prefix] of [["public/files", "files"], ["public/data", "data"]]) {
  for await (const f of walk(dir)) {
    const rel = path.relative(dir, f).split(path.sep).join("/");
    if (prefix === "files" && rel.startsWith("thumbs/")) continue; // thumbnails stay public
    jobs.push([f, `${prefix}/${rel}`]);
  }
}

const TYPES = { ".pdf": "application/pdf", ".json": "application/json", ".mp4": "video/mp4", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };
let done = 0;
const failed = [];
async function upload([file, dest]) {
  const body = await readFile(file);
  const contentType = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { error } = await sb.storage.from(BUCKET).upload(dest, body, { contentType, upsert: true, cacheControl: "3600" });
    if (!error) {
      if (++done % 50 === 0) console.log(`${done} / ${jobs.length}`);
      return;
    }
    if (attempt === 3) failed.push(`${dest}: ${error.message}`);
    else await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
}

let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < jobs.length) await upload(jobs[next++]);
}));

console.log(`Uploaded ${done} of ${jobs.length} files to "${BUCKET}".`);
if (failed.length) {
  console.error(`${failed.length} failed:\n${failed.join("\n")}`);
  process.exit(1);
}
