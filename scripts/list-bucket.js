const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function list() {
  const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://in-maa-1.linodeobjects.com',
    credentials: {
      accessKeyId: process.env.LINODE_S3_ACCESS_KEY?.trim(),
      secretAccessKey: process.env.LINODE_S3_SECRET_KEY?.trim(),
    },
    forcePathStyle: true,
  });

  try {
    const result = await client.send(new ListObjectsV2Command({
      Bucket: 'zexc',
      MaxKeys: 100,
    }));
    console.log('Objects in bucket:', result.KeyCount);
    console.log('Contents:', result.Contents?.map(c => c.Key).slice(0, 10));
  } catch (error) {
    console.log('Error:', error.Code || error.name, '-', error.message);
  }
}

list();
