import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Checks if the Supabase connection is alive.
 * Returns { connected: true } on success or { connected: false, error } on failure.
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('opportunities').select('id').limit(1);
    if (error) {
      const isTableMissing =
        error.code === 'PGRST116' ||
        error.message.toLowerCase().includes('does not exist') ||
        error.message.toLowerCase().includes('schema cache');
      if (isTableMissing) return { connected: true };
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { connected: false, error: message };
  }
}
