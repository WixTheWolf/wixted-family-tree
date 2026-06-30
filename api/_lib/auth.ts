import type { VercelRequest } from "@vercel/node";

export function isAuthRequired(): boolean {
  return Boolean(process.env.FAMILY_UPLOAD_KEY?.trim());
}

export function extractUploadKey(req: VercelRequest): string | undefined {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  const header = req.headers["x-family-key"];
  if (typeof header === "string") return header.trim();
  return undefined;
}

export function verifyUploadAuth(req: VercelRequest): boolean {
  const required = process.env.FAMILY_UPLOAD_KEY?.trim();
  if (!required) return true;
  return extractUploadKey(req) === required;
}
