import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const options: any = {};

// Make this available for server only imports
if (typeof window === 'undefined') {
    options.headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY}`
    };
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, options);
