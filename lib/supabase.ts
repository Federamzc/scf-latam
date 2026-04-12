import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://agxfybmgdwfocrksugqz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFneGZ5Ym1nZHdmb2Nya3N1Z3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDUyOTcsImV4cCI6MjA5MTUyMTI5N30.ZsCgbrOV6R09TMue1sb4dvLFdm3n3UPI_CEnw5gJIdo'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
})
