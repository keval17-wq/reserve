import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxslguqnzwkamoaenvn.supabase.co'; // <- Replace this
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHNsZ3Vxbnp3a2Ftb2FlbnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTQ0ODYsImV4cCI6MjA1ODg5MDQ4Nn0.Q5q2hQD3V_46LB4_AXhezhpvJ7GL_J2x6IWa49WTiQo'; // <- Replace this

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
