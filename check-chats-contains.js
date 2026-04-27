import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dfxghnjkyzsxdnrezoxf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0'
);

async function check() {
  const { data, error } = await supabase.from('chats').select('*').contains('participants', ["11"]);
  console.log("CHATS FOR 11:");
  console.log(JSON.stringify(data, null, 2));
  console.log("ERROR:", error);
}

check();
