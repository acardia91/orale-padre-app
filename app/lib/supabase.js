import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnpmigcbqgcggtkfkqeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucG1pZ2NicWdjZ2d0a2ZrcWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzYxNjUsImV4cCI6MjA5MDAxMjE2NX0.tS4rngJHZfaiFKleRioF5zIroWxkSEgpymH9EmNbsnU';

export const supabase = createClient(supabaseUrl, supabaseKey);
