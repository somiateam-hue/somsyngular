import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://qvmrbhwordaxmcafkhsw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bXJiaHdvcmRheG1jYWZraHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNDU3MjgsImV4cCI6MjA5MDgyMTcyOH0.LTQkHptsCxAppYBg2EZ57MaOG2GB1k-X4KanWyF0YV8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
