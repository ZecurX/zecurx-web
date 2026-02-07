const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'fsn1',
  endpoint: process.env.HETZNER_S3_ENDPOINT || 'https://fsn1.your-objectstorage.com',
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY || '',
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.HETZNER_S3_BUCKET || 'zecurx-web';

async function test() {
  console.log('Testing with Bucket:', BUCKET_NAME);
  console.log('Endpoint:', process.env.HETZNER_S3_ENDPOINT);
  console.log('Access Key:', process.env.HETZNER_S3_ACCESS_KEY);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: 'test-file.txt',
    ContentType: 'text/plain',
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated URL:', url);
  } catch (err) {
    console.error('FAILED to generate URL:', err);
  }
}

test();
