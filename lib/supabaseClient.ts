import { createClient } from '@supabase/supabase-js';

// CẤU HÌNH SUPABASE
// 1. Vào https://supabase.com/dashboard -> Project Settings -> API
// 2. Copy URL và anon/public Key dán vào dưới đây.

const SUPABASE_URL = 'https://gtiuuurvwoqdqpgqeidb.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0aXV1dXJ2d29xZHFwZ3FlaWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODQ3MzIsImV4cCI6MjA4MDc2MDczMn0.R4uxlh3R0MraArtu0YiXBk8idCUvD5_JdgdEthGpL-o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);