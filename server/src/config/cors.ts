import { CorsOptions } from "cors";
import { env } from "./env";

// Build allowed origins dynamically from environment
const allowedOrigins = [
  "http://localhost:3000", // local frontend dev
  "http://127.0.0.1:3000",
  "https://jemiarian.com", // production custom domain
  "https://www.jemiarian.com",
  "https://jemi-portofolio.vercel.app", // vercel frontend deployment
];

// Also add CORS_ORIGIN and NEXT_PUBLIC_SITE_URL from env if present
if (env.CORS_ORIGIN && !allowedOrigins.includes(env.CORS_ORIGIN)) {
  allowedOrigins.push(env.CORS_ORIGIN);
}
if (env.NEXT_PUBLIC_SITE_URL && !allowedOrigins.includes(env.NEXT_PUBLIC_SITE_URL)) {
  allowedOrigins.push(env.NEXT_PUBLIC_SITE_URL);
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
