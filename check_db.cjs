const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Supabase credentials not found in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data: users } = await supabase.from('user').select('id, role, full_name, auth_id').limit(5);
  console.log("Users:", users);

  const { data: companies } = await supabase.from('company_profile').select('id, user_id, website').limit(5);
  console.log("Companies:", companies);

  const { data: opportunities, error } = await supabase.from('opportunity').select('id, company_id, title').limit(5);
  console.log("Opportunities:", opportunities, error);
}

checkDb();
