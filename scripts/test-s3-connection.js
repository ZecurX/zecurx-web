const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function test() {
  console.log('Testing Linode S3 connection...\n');
  console.log('Endpoint:', process.env.LINODE_S3_ENDPOINT);
  console.log('Access Key:', process.env.LINODE_S3_ACCESS_KEY?.substring(0, 8) + '...');
  console.log('Bucket:', process.env.LINODE_S3_BUCKET);
  
  const client = new S3Client({
    region: 'in-maa-1',
    endpoint: 'https://in-maa-1.linodeobjects.com',
    credentials: {
      accessKeyId: process.env.LINODE_S3_ACCESS_KEY,
      secretAccessKey: process.env.LINODE_S3_SECRET_KEY,
    },
    forcePathStyle: false,
  });

  try {
    console.log('\n1. Testing simple upload...');
    const testContent = Buffer.from('Hello ZecurX!');
    await client.send(new PutObjectCommand({
      Bucket: process.env.LINODE_S3_BUCKET,
      Key: 'test.txt',
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read',
    }));
    console.log('✅ Upload successful!');
    console.log(`URL: https://${process.env.LINODE_S3_BUCKET}.in-maa-1.linodeobjects.com/test.txt`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

test();
