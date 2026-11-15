import { createHash, createHmac } from "node:crypto";

/**
 * Short-lived signed download links for the private Cloudflare R2 bucket (S3 "presigned GET",
 * AWS Signature Version 4). Server-only: it uses the secret key.
 */

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");
const hmac = (key: Buffer | string, s: string) => createHmac("sha256", key).update(s, "utf8").digest();

/** RFC 3986 encoding, as S3 expects (keeps "/" when encoding a path). */
function enc(s: string, keepSlash = false) {
  const out = encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
  return keepSlash ? out.replace(/%2F/g, "/") : out;
}

export type PresignInput = {
  host: string; // e.g. <account>.r2.cloudflarestorage.com
  path: string; // e.g. /<bucket>/files/x.pdf (unencoded)
  accessKeyId: string;
  secretAccessKey: string;
  region?: string; // R2: "auto"
  expiresIn?: number; // seconds
  now?: Date;
};

export function presignGet({ host, path, accessKeyId, secretAccessKey, region = "auto", expiresIn = 3600, now = new Date() }: PresignInput) {
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); // YYYYMMDDTHHMMSSZ
  const day = amzDate.slice(0, 8);
  const scope = `${day}/${region}/s3/aws4_request`;
  const query: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": "host",
  };
  const canonicalQuery = Object.keys(query)
    .sort()
    .map((k) => `${enc(k)}=${enc(query[k])}`)
    .join("&");
  const canonicalPath = enc(path, true);
  const canonicalRequest = ["GET", canonicalPath, canonicalQuery, `host:${host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${secretAccessKey}`, day);
  const kSigning = hmac(hmac(hmac(kDate, region), "s3"), "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");
  return `https://${host}${canonicalPath}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

/** Signed link to a file in the R2 bucket, or null when R2 is not configured. */
export function r2SignedUrl(key: string, expiresIn = 3600) {
  // Tolerate values pasted with spaces/line breaks, or the full endpoint URL instead of the Account ID.
  const clean = (v?: string) => (v ?? "").replace(/\s+/g, "");
  const account = clean(process.env.R2_ACCOUNT_ID).replace(/^https?:\/\//, "").split(/[./]/)[0];
  const accessKeyId = clean(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = clean(process.env.R2_BUCKET).split("/").pop();
  if (!account || !accessKeyId || !secretAccessKey || !bucket) return null;
  return presignGet({
    host: `${account}.r2.cloudflarestorage.com`,
    path: `/${bucket}/${key}`,
    accessKeyId,
    secretAccessKey,
    expiresIn,
  });
}
