// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yzbzakbfhiasyiwyeiej.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Ynpha2JmaGlhc3lpd3llaWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzY5NTMsImV4cCI6MjA3MTg1Mjk1M30.Bv-rI_jUzhgZiZaw_L-dCmJ8I9_Geb4hnOZqgMOU6p8"
export const supabase = createClient(supabaseUrl, supabaseKey)