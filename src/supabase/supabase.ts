import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zugionbtbljfyuybihxk.supabase.co' // 프로젝트 URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2lvbmJ0YmxqZnl1eWJpaHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDIyNTksImV4cCI6MjA2ODcxODI1OX0.iN1y_uBhWxdOQkOgcxYfROe3ERVKrOyZYTxEf8UOaJA' // 프로젝트 public API 키

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
