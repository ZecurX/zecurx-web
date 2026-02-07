const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'fsn1',
  endpoint: process.env.HETZNER_S3_ENDPOINT || 'https://fsn1.your-objectstorage.com',
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.HETZNER_S3_BUCKET || 'zecurx-web';

async function setCors() {
  console.log(`Setting CORS for bucket: ${BUCKET_NAME}...`);
  
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: [
          'http://localhost:3000',
          'https://zecurx.com',
          'https://www.zecurx.com',
          'https://zecurx-web.vercel.app',
          'https://*.vercel.app'
        ],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000
      }
    ]
  };

  try {
    const command = new PutBucketCorsCommand({
      Bucket: BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    });

    await s3Client.send(command);
    console.log('CORS configuration set successfully!');
  } catch (err) {
    console.error('Error setting CORS:', err);
  }
}

setCors();
