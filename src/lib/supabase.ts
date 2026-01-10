import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

// Note: Using Service Role Key for Admin operations securely on the server.
// For client-side, we would use the Anon key, but most of our admin logic will be server-side or API routes.
export const supabase = createClient(supabaseUrl, supabaseKey);
