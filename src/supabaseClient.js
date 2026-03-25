import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xubpjdmdepmppowolyay.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnBqZG1kZXBtcHBvd29seWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTI4MDAsImV4cCI6MjA4OTc2ODgwMH0.-0VcUMf9NMVxRjuy6iENnnOOsSnh16U6dnwmCao99Fs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)