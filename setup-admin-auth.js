import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dfxghnjkyzsxdnrezoxf.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM3MzE5MCwiZXhwIjoyMDczOTQ5MTkwfQ.yZQdNdVACm3GJ0t7pkye7xOJ9mlkqkEKaO1QVFev5RE';

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function setupAdmin() {
  const email = 'admin@admin.com';
  const password = 'admin#12345';
  
  console.log("Checking if auth user exists...");
  let { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("List users error:", listError);
    return;
  }
  
  let authUser = users.users.find(u => u.email === email);
  
  if (!authUser) {
    console.log("Auth user not found, creating...");
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (createError) {
      console.error("Create user error:", createError);
      return;
    }
    
    authUser = created.user;
    console.log("Created Auth user:", authUser.id);
  } else {
    console.log("Auth user found:", authUser.id);
  }
  
  console.log("Updating DB user table...");
  const { data: updated, error: updateError } = await supabase
    .from('user')
    .update({ auth_id: authUser.id })
    .eq('email', email)
    .select();
    
  if (updateError) {
    console.error("Update DB error:", updateError);
  } else {
    console.log("DB updated:", updated);
  }
}

setupAdmin();
