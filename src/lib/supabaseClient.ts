import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvowgjzaejkqibheqbay.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b3dnanphZWprcWliaGVxYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTU5NjUsImV4cCI6MjA2MTY5MTk2NX0.5aB1CtFDJah7rHd6BxzsAN_S_UmVPvccOWztYO2Rj9U'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
