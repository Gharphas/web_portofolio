import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // secara dinamis mengimpor app Express agar bootstrap error dapat ditangkap
    const module = await import("../src/index");
    const app = (module.default || module) as any;
    
    // Oper request dan response ke Express app
    return app(req, res);
  } catch (err: any) {
    console.error("🔥 Serverless Bootstrap Crash:", err);
    
    // Kembalikan detail error runtime langsung ke response agar bisa didebug
    res.status(500).json({
      error: "SERVERLESS_BOOTSTRAP_CRASH",
      message: err.message || String(err),
      stack: err.stack || null,
      tip: "Periksa environment variables Anda di Vercel atau inisialisasi modul."
    });
  }
}
