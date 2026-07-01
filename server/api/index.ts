import { VercelRequest, VercelResponse } from "@vercel/node";

// Static reference to force Vercel bundler to bundle the source files and dependencies
if (false as any) {
  require("../src/index");
  require("better-auth");
  require("better-auth/node");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Secara dinamis mengimpor app Express agar bootstrap error dapat ditangkap
    const module = await import("../src/index");
    const app = (module.default || module) as any;
    
    if (typeof app !== "function") {
      throw new Error(`Express app is not a function. Type: ${typeof app}`);
    }
    
    // Oper request dan response ke Express app
    return app(req, res);
  } catch (err: any) {
    console.error("🔥 Serverless Bootstrap Crash:", err);
    
    res.status(500).json({
      error: "SERVERLESS_BOOTSTRAP_CRASH",
      message: err.message || String(err),
      stack: err.stack || null,
      tip: "Periksa variabel lingkungan (environment variables) Anda di Vercel Dashboard."
    });
  }
}
