const { getSignedUploadUrl } = require('./src/lib/s3');
require('dotenv').config({ path: '.env.local' });

async function test() {
  try {
    console.log('Testing with Env:', {
      accessKey: process.env.HETZNER_S3_ACCESS_KEY ? 'Present' : 'Missing',
      secretKey: process.env.HETZNER_S3_SECRET_KEY ? 'Present' : 'Missing',
      endpoint: process.env.HETZNER_S3_ENDPOINT
    });
    
    const result = await getSignedUploadUrl('test-key.txt', 'text/plain');
    console.log('Success:', result.uploadUrl.substring(0, 100) + '...');
  } catch (err) {
    console.error('FAILED:', err);
  }
}

test();
