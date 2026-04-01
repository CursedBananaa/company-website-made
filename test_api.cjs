const axios = require('axios');
const fs = require('fs');
const API_URL = 'https://sha8alny-backend-857164936517.us-central1.run.app/api';

async function testApi() {
  try {
    const email = `test4${Date.now()}@example.com`;
    const password = 'Password123!';
    let logData = {};
    
    try {
      await axios.post(`${API_URL}/Auth/register`, { email, password, role: "company" });
    } catch(e) {}

    const loginRes = await axios.post(`${API_URL}/Auth/login`, { email, password });
    const token = loginRes.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      companyName: "TechCorp Solutions",
      description: "Leading software development firm.",
      industry: "IT Services",
      websiteUrl: "https://techcorp.com",
      address: "123 Tech Park",
      city: "Cairo",
      country: "Egypt",
      contactEmail: "hr@techcorp.com",
      logoUrl: "/uploads/logos/default.png"
    };
    
    try {
      const postRes = await axios.post(`${API_URL}/companies/profile`, payload, { headers });
      logData.postResponse = postRes.data;
    } catch (e) {
      logData.postError = e.response?.data;
    }

    try {
      const getRes = await axios.get(`${API_URL}/companies/profile`, { headers });
      logData.getResponse = getRes.data;
    } catch (e) {
      logData.getError = e.response?.data;
    }

    fs.writeFileSync('api_result.json', JSON.stringify(logData, null, 2));
  } catch(e) {
    fs.writeFileSync('api_result.json', JSON.stringify({ error: e.message }));
  }
}
testApi();
