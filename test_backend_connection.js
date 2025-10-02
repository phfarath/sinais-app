// Test script to verify backend connectivity
// Run this with: node test_backend_connection.js

const fetch = require('node-fetch');

const API_BASE = 'http://192.168.15.10:8000';

async function testConnection() {
  console.log(`Testing connection to ${API_BASE}...`);
  
  try {
    // Test root endpoint
    console.log('\n1. Testing root endpoint...');
    const rootResponse = await fetch(`${API_BASE}/`, { timeout: 5000 });
    console.log(`Status: ${rootResponse.status}`);
    const rootData = await rootResponse.json();
    console.log('Response:', rootData);
    
    // Test health endpoint
    console.log('\n2. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/api/health`, { timeout: 5000 });
    console.log(`Status: ${healthResponse.status}`);
    const healthData = await healthResponse.json();
    console.log('Response:', healthData);
    
    console.log('\n✅ Backend is accessible!');
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\nPossible solutions:');
      console.log('1. Make sure the backend is running (python backend/main.py)');
      console.log('2. Check if the IP address 192.168.15.10 is correct');
      console.log('3. Verify there are no firewall blocking the connection');
      console.log('4. Ensure your device is on the same network as the backend');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\nPossible solutions:');
      console.log('1. The server is taking too long to respond');
      console.log('2. Check if the backend is still running');
      console.log('3. Verify network connectivity');
    }
  }
}

testConnection();