import { createClient } from "@supabase/supabase-js";
import { env, getSupabaseApiUrl } from "./env";

const supabaseUrl = getSupabaseApiUrl();
const supabaseKey = env.SERVICE_ROLE_SECRET;

console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);

// Initialize Supabase admin client (Service Role has admin rights and bypasses RLS)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null as any;
