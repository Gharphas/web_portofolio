import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { env } from "./env";

// Initialize PostgreSQL pool with SSL enabled for Supabase
const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase pooler connections
  }
});

export const auth = betterAuth({
  database: pool,
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
  trustedOrigins: [
    env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "http://localhost:3000"
  ]
});
