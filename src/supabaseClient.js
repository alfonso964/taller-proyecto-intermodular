import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubpjmdepmppowolyay.supabase.co'
const supabaseAnonKey = 'sb_publishable_a55H5tlgVRt2RsQJZ0kx7A_jb3zCt7C'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)