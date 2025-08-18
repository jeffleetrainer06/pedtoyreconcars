import { createClient } from '@supabase/supabase-js'

// Add these lines:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL from import.meta.env:', supabaseUrl);
console.log('Supabase Anon Key from import.meta.env:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please check your .env file.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
