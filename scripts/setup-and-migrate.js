const { S3Client, CreateBucketCommand, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
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

const BUCKET = 'zecx';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

function getAllImages(dir, baseDir = dir) {
  const files = [];
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
  return files;
}

async function run() {
  console.log('1. Creating bucket...');
  try {
    await client.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log('   Bucket created!');
  } catch (e) {
    if (e.Code === 'BucketAlreadyOwnedByYou') console.log('   Bucket exists');
    else console.log('   Bucket:', e.Code || e.name);
  }

  console.log('\n2. Uploading images...');
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
