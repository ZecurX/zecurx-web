const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://fsn1.your-objectstorage.com',
    credentials: {
      accessKeyId: process.env.HETZNER_S3_ACCESS_KEY?.trim(),
      secretAccessKey: process.env.HETZNER_S3_SECRET_KEY?.trim(),
    },
    forcePathStyle: true,
  });

  console.log('Testing new credentials with bucket: zexc\n');

  try {
    const list = await client.send(new ListObjectsV2Command({ Bucket: 'zexc', MaxKeys: 5 }));
    console.log('✅ List works! Objects:', list.KeyCount);
    
    await client.send(new PutObjectCommand({
      Bucket: 'zexc',
      Key: 'test-new-key.txt',
      Body: Buffer.from('Test with new credentials ' + new Date().toISOString()),
      ContentType: 'text/plain',
    }));
    console.log('✅ Upload works!');
    console.log('\nBucket URL: https://zecurx-web.fsn1.your-objectstorage.com/');
  } catch (e) {
    console.log('❌ Error:', e.Code || e.name, '-', e.message);
  }
}

test();
