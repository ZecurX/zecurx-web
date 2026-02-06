const { S3Client, CreateBucketCommand, PutObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const accessKey = process.env.HETZNER_S3_ACCESS_KEY?.trim();
  const secretKey = process.env.HETZNER_S3_SECRET_KEY?.trim();
  
  console.log('Access Key length:', accessKey?.length);
  console.log('Secret Key length:', secretKey?.length);
  
  const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://fsn1.your-objectstorage.com',
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });

  try {
    console.log('\nTrying to create bucket...');
    await client.send(new CreateBucketCommand({ Bucket: 'zecx' }));
    console.log('✅ Bucket created!');
  } catch (error) {
    if (error.Code === 'BucketAlreadyOwnedByYou' || error.name === 'BucketAlreadyOwnedByYou') {
      console.log('✅ Bucket already exists');
    } else {
      console.log('Bucket creation result:', error.Code || error.name, error.message);
    }
  }

  try {
    console.log('\nTrying upload...');
    await client.send(new PutObjectCommand({
      Bucket: 'zecx',
      Key: 'test.txt',
      Body: Buffer.from('Hello ZecurX ' + new Date().toISOString()),
      ContentType: 'text/plain',
      ACL: 'public-read',
    }));
    console.log('✅ Upload successful!');
    console.log('URL: https://zecurx-web.fsn1.your-objectstorage.com/test.txt');
  } catch (error) {
    console.log('Upload error:', error.Code || error.name, '-', error.message);
  }
}

test();
