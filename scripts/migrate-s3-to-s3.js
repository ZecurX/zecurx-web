const { S3Client, ListObjectsV2Command, CopyObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env.linode' });

const linodeClient = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.LINODE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LINODE_S3_ACCESS_KEY,
    secretAccessKey: process.env.LINODE_S3_SECRET_KEY,
  },
});

const hetznerClient = new S3Client({
  region: 'fsn1',
  endpoint: process.env.HETZNER_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const LINODE_BUCKET = process.env.LINODE_S3_BUCKET;
const HETZNER_BUCKET = process.env.HETZNER_S3_BUCKET;

async function migrate() {
  console.log(`Migrating from Linode (${LINODE_BUCKET}) to Hetzner (${HETZNER_BUCKET})...`);

  try {
    let continuationToken;
    let totalCount = 0;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: LINODE_BUCKET,
        ContinuationToken: continuationToken,
      });

      const listResponse = await linodeClient.send(listCommand);
      
      if (!listResponse.Contents) {
        console.log('No files found in Linode bucket.');
        break;
      }

      for (const item of listResponse.Contents) {
        const key = item.Key;
        console.log(`Processing: ${key}...`);

        try {
          // Check if file already exists in Hetzner
          try {
            await hetznerClient.send(new HeadObjectCommand({
              Bucket: HETZNER_BUCKET,
              Key: key,
            }));
            console.log(`⏭️  Skipping (already exists): ${key}`);
            continue;
          } catch (headErr) {
            // If 404, proceed with migration
            if (headErr.name !== 'NotFound') {
              throw headErr;
            }
          }

          console.log(`Downloading: ${key}...`);
          const { GetObjectCommand } = require('@aws-sdk/client-s3');
          const getResponse = await linodeClient.send(new GetObjectCommand({
            Bucket: LINODE_BUCKET,
            Key: key,
          }));

          const body = await getResponse.Body.transformToByteArray();

          console.log(`Uploading: ${key}...`);
          const { PutObjectCommand } = require('@aws-sdk/client-s3');
          try {
            await hetznerClient.send(new PutObjectCommand({
              Bucket: HETZNER_BUCKET,
              Key: key,
              Body: body,
              ContentType: getResponse.ContentType,
            }));
          } catch (uploadErr) {
            console.error(`Upload error for ${key}:`, uploadErr);
            throw uploadErr;
          }

          console.log(`✅ Migrated: ${key}`);
          totalCount++;
        } catch (err) {
          console.error(`❌ Failed: ${key}`, err.message);
        }
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    console.log(`\nMigration complete! Total files: ${totalCount}`);
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrate();
