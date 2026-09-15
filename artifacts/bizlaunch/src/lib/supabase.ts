import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Vite inlines these at build time. If they are missing the build produces
// empty strings and createClient throws on load, which renders a blank page —
// fail loudly instead so the misconfiguration is obvious.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set at build time.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
