/**
 * Demon API Platform - JavaScript Client SDK Demo
 * Run: node examples/client_demo.js
 */

const DEMON_API_KEY = 'sk-demon-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c';
const BASE_URL = 'http://localhost:3000/api/v1';

async function testDemonApi() {
  console.log('🔥 DEMON API PLATFORM CLIENT DEMO\n');

  // 1. AI Chat
  console.log('🧠 1. Testing AI Chat...');
  const aiRes = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEMON_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: 'Hello from Node.js client!' })
  });
  console.log('AI Response:', await aiRes.json());

  // 2. Security IP Check
  console.log('\n🛡️ 2. Testing Security IP Lookup...');
  const ipRes = await fetch(`${BASE_URL}/security/ip`, {
    headers: { 'Authorization': `Bearer ${DEMON_API_KEY}` }
  });
  console.log('IP Lookup:', await ipRes.json());

  // 3. Utilities UUID
  console.log('\n🛠️ 3. Testing UUID Generator...');
  const uuidRes = await fetch(`${BASE_URL}/utilities/uuid`, {
    headers: { 'Authorization': `Bearer ${DEMON_API_KEY}` }
  });
  console.log('UUID Response:', await uuidRes.json());
}

testDemonApi();
