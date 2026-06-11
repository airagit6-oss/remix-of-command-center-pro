import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to execute queries with error handling
export async function executeQuery<T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Query execution error:', err);
    return null;
  }
}
