const url = "https://dfxghnjkyzsxdnrezoxf.supabase.co/rest/v1/opportunity?select=*,company_profile(user(full_name))";
const headers = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeGdobmpreXpzeGRucmV6b3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMxOTAsImV4cCI6MjA3Mzk0OTE5MH0.6mnMvSTyQ9g3FMYrVHS6h-he5e2K7-dY9F5VAXqX8g0"
};

async function check() {
  const res = await fetch(url, { headers });
  const data = await res.json();
  console.log("Query Response:", JSON.stringify(data, null, 2));
}
check();
