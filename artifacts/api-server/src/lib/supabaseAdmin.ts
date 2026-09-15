import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Admin client used only to delete a user's auth record when they close their
 * account. Requires SUPABASE_SERVICE_ROLE_KEY; without it we can erase the
 * user's data but cannot remove their login, so the caller must tell the user
 * the truth rather than claiming a full deletion.
 */
export const supabaseAdmin: SupabaseClient | null =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const canDeleteAuthUsers = supabaseAdmin !== null;
