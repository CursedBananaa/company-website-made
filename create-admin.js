import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dfxghnjkyzsxdnrezoxf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0'
);

async function check() {
  const { data: existing } = await supabase.from('user').select('id').eq('email', 'admin@admin.com').single();
  if (existing) {
    console.log("Admin exists:", existing);
    return;
  }
  
  const { data, error } = await supabase.from('user').insert({
    email: 'admin@admin.com',
    full_name: 'System Admin',
    role: 'admin',
    password: 'mock_password'
  }).select().single();
  
  console.log("CREATED ADMIN:", data);
  console.log("ERROR:", error);
}

check();
