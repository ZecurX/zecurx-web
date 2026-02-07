const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const config = {
    region: 'fsn1',
    endpoint: 'https://fsn1.your-objectstorage.com',
    credentials: {
      accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
      secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
    },
    forcePathStyle: true,
  };
  
  console.log('Testing with Path Style...');
  const client1 = new S3Client(config);
  try {
    const data = await client1.send(new ListBucketsCommand({}));
    console.log('✅ Path Style Success:', data.Buckets.map(b => b.Name));
    return;
  } catch (e) {
    console.log('❌ Path Style Failed:', e.message);
  }

  console.log('\nTesting with Virtual Hosted Style...');
  const client2 = new S3Client({ ...config, forcePathStyle: false });
  try {
    const data = await client2.send(new ListBucketsCommand({}));
    console.log('✅ Virtual Hosted Success:', data.Buckets.map(b => b.Name));
  } catch (e) {
    console.log('❌ Virtual Hosted Failed:', e.message);
  }
}

test();
