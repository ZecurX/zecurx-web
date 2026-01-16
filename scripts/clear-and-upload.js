const { S3Client, ListObjectsV2Command, DeleteObjectsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
require('dotenv').config({ path: '.env.local' });

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://in-maa-1.linodeobjects.com',
  credentials: {
    accessKeyId: process.env.LINODE_S3_ACCESS_KEY?.trim(),
    secretAccessKey: process.env.LINODE_S3_SECRET_KEY?.trim(),
  },
  forcePathStyle: true,
});

const BUCKET = 'zexc';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

function getAllImages(dir, baseDir = dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getAllImages(fullPath, baseDir));
      } else {
        const ext = path.extname(item).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          files.push({ fullPath, key: path.relative(baseDir, fullPath).replace(/\\/g, '/') });
        }
      }
    }
  } catch (e) {}
  return files;
}

async function run() {
  console.log('1. Deleting all existing objects...');
  try {
    let deleted = 0;
    let hasMore = true;
    while (hasMore) {
      const list = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 1000 }));
      if (!list.Contents || list.Contents.length === 0) {
        hasMore = false;
        break;
      }
      await client.send(new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: list.Contents.map(o => ({ Key: o.Key })) }
      }));
      deleted += list.Contents.length;
      console.log(`   Deleted ${deleted} objects...`);
      hasMore = list.IsTruncated;
    }
    console.log(`   Done! Total deleted: ${deleted}\n`);
  } catch (e) {
    console.log('   Delete error:', e.Code || e.name, '-', e.message);
    return;
  }

  console.log('2. Uploading images...');
  const images = getAllImages(PUBLIC_DIR);
  console.log(`   Found ${images.length} images\n`);

  let success = 0, failed = 0;
  for (const { fullPath, key } of images) {
    try {
      await client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fs.readFileSync(fullPath),
        ContentType: mime.lookup(fullPath) || 'application/octet-stream',
        CacheControl: 'public, max-age=31536000',
      }));
      console.log(`   ✓ ${key}`);
      success++;
    } catch (e) {
      console.log(`   ✗ ${key}: ${e.Code || e.name}`);
      failed++;
    }
  }

  console.log(`\n3. Done! Uploaded: ${success}, Failed: ${failed}`);
  console.log(`   URL: https://${BUCKET}.in-maa-1.linodeobjects.com/`);
}

run().catch(console.error);
