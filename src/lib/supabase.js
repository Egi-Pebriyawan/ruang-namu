import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxnytrhitagdhezezivn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase. For production, ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
