import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dfxghnjkyzsxdnrezoxf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0');

async function run() {
  const { data, error } = await supabase.from('announcement').insert({
    name: 'Test Name',
    description: 'Test Desc',
  }).select();
  if (error) {
    console.error('Table insert error:', error);
  } else {
    console.log('Inserted. Data:', data);
  }
}
run();
