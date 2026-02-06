const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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

  try {
    console.log('Uploading to bucket: zexc (without ACL)...');
    await client.send(new PutObjectCommand({
      Bucket: 'zexc',
      Key: 'test.txt',
      Body: Buffer.from('Hello ZecurX ' + new Date().toISOString()),
      ContentType: 'text/plain',
    }));
    console.log('✅ Upload successful!');
    console.log('URL: https://zecurx-web.fsn1.your-objectstorage.com/test.txt');
  } catch (error) {
    console.log('Upload error:', error.Code || error.name, '-', error.message);
    console.log('Full:', JSON.stringify(error.$metadata, null, 2));
  }
}

test();
