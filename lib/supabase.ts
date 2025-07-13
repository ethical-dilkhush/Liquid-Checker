import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Profile {
  id: string
  name: string
  avatar: string
  role?: string
  bio?: string
  stats?: {
    posts: number
    followers: number
    following: number
  }
  created_at?: string
  updated_at?: string
}
