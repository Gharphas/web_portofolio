import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from the parent .env file (local dev only).
try {
  dotenv.config({ path: path.join(process.cwd(), "../.env") });
  dotenv.config({ path: path.join(process.cwd(), ".env") });
} catch {
  // Silently ignore — on Vercel this file does not exist.
}

const envSchema = z.object({
  PORT: z.string().default("4000").transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_URL: z.string().min(1, "SUPABASE_URL connection string is required"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  SERVICE_ROLE_SECRET: z.string().min(1, "SERVICE_ROLE_SECRET is required"),
  ANON_PBBLIC_KEY: z.string().optional(),
  REVALIDATION_SECRET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  CORS_ORIGIN: z.string().optional(),
});

const envToParse = {
  PORT: process.env.EXPRESS_PORT || process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SERVICE_ROLE_SECRET: process.env.SERVICE_ROLE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY,
  ANON_PBBLIC_KEY: process.env.ANON_PBBLIC_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

const parsedEnv = envSchema.safeParse(envToParse);

if (!parsedEnv.success) {
  const errorDetails = parsedEnv.error.format();
  console.error("❌ ENVIRONMENT VALIDATION FAILED:", JSON.stringify(errorDetails, null, 2));
  throw new Error(`Environment validation failed: ${Object.keys(errorDetails).filter(k => k !== '_errors').join(', ')} are invalid.`);
}

export const env = parsedEnv.data;

// Helper to extract Supabase project reference and construct API URL
export function getSupabaseApiUrl(): string {
  // Always prefer explicit NEXT_PUBLIC_SUPABASE_URL if set and starts with http
  if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http")) {
    return env.NEXT_PUBLIC_SUPABASE_URL;
  }

  const dbUrl = env.SUPABASE_URL;
  if (dbUrl.includes("postgres.")) {
    const match = dbUrl.match(/postgres\.([^:@/]+)/);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
  }
  
  if (dbUrl.startsWith("http")) {
    return dbUrl;
  }
  
  // Fallback to avoid crashing the server
  return "https://vqfmvnwuruqdyzbgiovv.supabase.co";
}
