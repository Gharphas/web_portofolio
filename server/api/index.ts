import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/index";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Handle both ES module default export and CommonJS module export
    const expressApp = (app && (app as any).default) ? (app as any).default : app;
    
    if (typeof expressApp !== "function") {
      throw new Error(`Express app is not a function. Type of imported app: ${typeof app}, Type of resolved app: ${typeof expressApp}`);
    }
    
    // Oper request dan response ke Express app
    return expressApp(req, res);
  } catch (err: any) {
    console.error("🔥 Serverless Request Crash:", err);
    
    res.status(500).json({
      error: "SERVERLESS_REQUEST_CRASH",
      message: err.message || String(err),
      stack: err.stack || null,
      tip: "Periksa pemuatan modul Express Anda."
    });
  }
}
