import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthRequired, verifyUploadAuth } from "./_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    authRequired: isAuthRequired(),
    blobAvailable: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    authenticated: verifyUploadAuth(req),
  });
}
