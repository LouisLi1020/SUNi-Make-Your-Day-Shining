import 'dotenv/config';
import { fetch } from 'undici';

const API = process.env.API_URL || 'http://localhost:5000';

async function run() {
  try {
    const email = `e2e_${Date.now()}@example.com`;
    const password = 'password123';

    // Register
    const regRes = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: 'E2E Tester', password, confirmPassword: password })
    });
    const regJson = await regRes.json();
    console.log('REGISTER', regRes.status, JSON.stringify(regJson));

    // Login
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginJson = await loginRes.json();
    console.log('LOGIN', loginRes.status, JSON.stringify(loginJson));

    const token = (loginJson as any)?.data?.tokens?.accessToken;
    if (!token) throw new Error('No access token from login');

    // Profile
    const meRes = await fetch(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meJson = await meRes.json();
    console.log('PROFILE', meRes.status, JSON.stringify(meJson));

    process.exit(0);
  } catch (err) {
    console.error('❌ E2E auth test failed:', err);
    process.exit(1);
  }
}

run();
