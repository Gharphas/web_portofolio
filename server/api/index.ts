import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Oper request dan response ke Express app
    return (app as any)(req, res);
  } catch (err: any) {
    console.error("🔥 Serverless Request Crash:", err);
    
    res.status(500).json({
      error: "SERVERLESS_REQUEST_CRASH",
      message: err.message || String(err),
      stack: err.stack || null,
    });
  }
}
