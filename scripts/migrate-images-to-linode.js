#!/usr/bin/env node

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

require('dotenv').config({ path: '.env.local' });

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://in-maa-1.linodeobjects.com',
  credentials: {
    accessKeyId: process.env.LINODE_S3_ACCESS_KEY?.trim(),
    secretAccessKey: process.env.LINODE_S3_SECRET_KEY?.trim(),
  },
  forcePathStyle: true,
});

const BUCKET_NAME = 'zexc';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

async function fileExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000',
  }));
}

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
        const relativePath = path.relative(baseDir, fullPath);
        files.push({ fullPath, relativePath });
      }
    }
  }
  
  return files;
}

async function migrate() {
  console.log('Starting image migration to Linode Object Storage...\n');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Endpoint: https://in-maa-1.linodeobjects.com\n`);
  
  const images = getAllImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to migrate\n`);
  
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const { fullPath, relativePath } of images) {
    const key = relativePath.replace(/\\/g, '/');
    
    try {
      const exists = await fileExists(key);
      if (exists) {
        console.log(`Skipped (exists): ${key}`);
        skipped++;
        continue;
      }
      
      await uploadFile(fullPath, key);
      console.log(`Uploaded: ${key}`);
      uploaded++;
    } catch (error) {
      console.error(`Failed: ${key} - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\nMigration Summary:');
  console.log(`   Uploaded: ${uploaded}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\nBase URL: https://${BUCKET_NAME}.in-maa-1.linodeobjects.com/`);
}

migrate().catch(console.error);
