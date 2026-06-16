import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dfxghnjkyzsxdnrezoxf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0'
);

async function check() {
  console.log("Inserting test notification...");
  const { data: inserted, error: insertError } = await supabase
    .from('notifications')
    .insert({
      u_id: 43,
      title: 'Test Notification Title',
      body: 'This is a test notification body',
      is_read: false
    })
    .select();

  console.log("Inserted:", inserted, "Error:", insertError);

  console.log("Querying notifications...");
  const { data: queryData, error: queryError } = await supabase
    .from('notifications')
    .select('*')
    .eq('u_id', 43);

  console.log("Queried:", queryData, "Error:", queryError);
}

check();
