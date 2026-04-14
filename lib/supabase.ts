import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://agxfybmgdwfocrksugqz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneGZ5Ym1nZHdmb2Nya3N1Z3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDUyOTcsImV4cCI6MjA5MTUyMTI5N30.ZsCgbrOV6R09TMue1sb4dvLFdm3n3UPI_CEnw5gJIdo',
  {
    db: { schema: 'public' },
    auth: { persistSession: true }
  }
)
// rebuild Mon Apr 13 18:07:36 CST 2026
