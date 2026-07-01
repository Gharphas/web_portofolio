import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env, envValidationError } from "./env";

// Initialize PostgreSQL pool with SSL enabled for Supabase
let pool: any = null;
if (!envValidationError && env.SUPABASE_URL && env.SUPABASE_URL.startsWith("postgres")) {
  try {
    pool = new Pool({
      connectionString: env.SUPABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Supabase pooler connections
      }
    });
  } catch (err: any) {
    console.error("❌ Failed to initialize PG Pool:", err);
  }
}

// Build trusted origins list dynamically from environment
const trustedOrigins: string[] = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Add the configured site URL (production frontend)
if (env.NEXT_PUBLIC_SITE_URL && !trustedOrigins.includes(env.NEXT_PUBLIC_SITE_URL)) {
  trustedOrigins.push(env.NEXT_PUBLIC_SITE_URL);
}

// Add CORS_ORIGIN if it differs from NEXT_PUBLIC_SITE_URL
if (env.CORS_ORIGIN && !trustedOrigins.includes(env.CORS_ORIGIN)) {
  trustedOrigins.push(env.CORS_ORIGIN);
}

export let auth: any = null;

try {
  if (pool) {
    auth = betterAuth({
      database: pool,
      baseURL: process.env.BETTER_AUTH_URL || undefined,
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "user"
          }
        }
      },
      emailAndPassword: {
        enabled: true,
        autoSignIn: true
      },
      // Ensure the secret is set, fall back to JWT_SECRET or a default
      secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "jemiarian_default_secret_better_auth_key_9988",
      
      // Set trusted origins for Next.js app communication
      trustedOrigins,

      advanced: {
        // Automatically resolve the correct URL from request headers on Vercel
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
        },
      },
    });
  }
} catch (err: any) {
  console.error("❌ Failed to initialize Better Auth:", err);
}
