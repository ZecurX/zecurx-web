const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
require('dotenv').config({ path: '.env.local' });

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://fsn1.your-objectstorage.com',
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY?.trim(),
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY?.trim(),
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
  console.log('Uploading with public-read ACL...\n');
  const images = getAllImages(PUBLIC_DIR);
  
  let success = 0, failed = 0;
  for (const { fullPath, key } of images) {
    try {
      await client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fs.readFileSync(fullPath),
        ContentType: mime.lookup(fullPath) || 'application/octet-stream',
        CacheControl: 'public, max-age=31536000',
        ACL: 'public-read',
      }));
      process.stdout.write('.');
      success++;
    } catch (e) {
      process.stdout.write('x');
      failed++;
    }
  }
  
  console.log(`\n\nDone! Success: ${success}, Failed: ${failed}`);
}

run();
