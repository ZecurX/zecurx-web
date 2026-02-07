const { S3Client, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function createBucket() {
  const client = new S3Client({
    region: 'in-maa-1',
    endpoint: 'https://fsn1.your-objectstorage.com',
    credentials: {
      accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
      secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
    },
    forcePathStyle: false,
  });

  try {
    console.log('Listing existing buckets...');
    const listResult = await client.send(new ListBucketsCommand({}));
    console.log('Existing buckets:', listResult.Buckets?.map(b => b.Name) || 'none');
    
    console.log('\nCreating bucket "zecx"...');
    await client.send(new CreateBucketCommand({
      Bucket: 'zecx',
    }));
    console.log('✅ Bucket created successfully!');
  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log('✅ Bucket already exists and is owned by you');
    } else {
      console.error('Error:', error.name, error.message);
    }
  }
}

createBucket();
