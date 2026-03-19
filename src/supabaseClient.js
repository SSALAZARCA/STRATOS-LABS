import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a placeholder that doesn't crash initialization if real values are missing
const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = (rawKey && rawKey !== 'your_supabase_anon_key_here') ? rawKey : 'placeholder';

if (!rawUrl || rawUrl.includes('placeholder')) {
    console.warn('Supabase credentials missing or invalid. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
