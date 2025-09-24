const fetch = require('node-fetch');

async function testReset() {
  try {
    console.log('Testing reset endpoint...');

    const response = await fetch('http://localhost:8080/api/reset-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js test'
      },
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response:', result);

  } catch (error) {
    console.error('Error:', error);
  }
}

testReset();