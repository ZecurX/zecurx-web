const { S3Client, PutBucketPolicyCommand, PutBucketAclCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function setPublic() {
  const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://fsn1.your-objectstorage.com',
    credentials: {
      accessKeyId: process.env.HETZNER_S3_ACCESS_KEY?.trim(),
      secretAccessKey: process.env.HETZNER_S3_SECRET_KEY?.trim(),
    },
    forcePathStyle: true,
  });

  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: "arn:aws:s3:::zexc/*"
      }
    ]
  };

  try {
    console.log('Setting bucket policy for public read access...');
    await client.send(new PutBucketPolicyCommand({
      Bucket: 'zexc',
      Policy: JSON.stringify(bucketPolicy),
    }));
    console.log('Bucket policy set successfully!');
  } catch (error) {
    console.log('Error setting policy:', error.Code || error.name, '-', error.message);
  }
}

setPublic();
