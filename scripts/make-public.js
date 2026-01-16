const { S3Client, PutBucketAclCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function makePublic() {
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
    console.log('Setting bucket ACL to public-read...');
    await client.send(new PutBucketAclCommand({
      Bucket: 'zexc',
      ACL: 'public-read',
    }));
    console.log('✅ Bucket is now public!');
  } catch (e) {
    console.log('Error:', e.Code || e.name, '-', e.message);
  }
}

makePublic();
