// ═══════════════════════════════════════════
// Supabase Client — Browser-side
// Used for public data reads from Next.js frontend
// ═══════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Note: The NEXT_PUBLIC_SUPABASE_URL should be the REST API URL
// e.g., https://vqfmvnwuruqdyzbgiovv.supabase.co
// NOT the pooler connection string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle auth via Express JWT
  },
});
