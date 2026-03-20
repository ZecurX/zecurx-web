import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Guard clauses for environment variables
if (!process.env.HETZNER_S3_ACCESS_KEY) {
  throw new Error('HETZNER_S3_ACCESS_KEY environment variable is required');
}

if (!process.env.HETZNER_S3_SECRET_KEY) {
  throw new Error('HETZNER_S3_SECRET_KEY environment variable is required');
}

if (!process.env.HETZNER_S3_BUCKET) {
  throw new Error('HETZNER_S3_BUCKET environment variable is required');
}

// Initialize S3 client
const s3Client = new S3Client({
  region: 'fsn1',
  endpoint: 'https://fsn1.your-objectstorage.com',
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY.trim(),
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY.trim(),
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.HETZNER_S3_BUCKET;
const PUBLIC_DIR = join(process.cwd(), 'public');

/**
 * Get content type based on file extension.
 * Parse, don't validate - returns a trusted type for S3.
 */
function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  
  const contentTypeMap: Record<string, string> = {
    // Fonts
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    
    // JSON and manifests
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    
    // Images
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    
    // PDFs
    '.pdf': 'application/pdf',
  };
  
  return contentTypeMap[ext] || 'application/octet-stream';
}

interface FileEntry {
  fullPath: string;
  key: string;
}

/**
 * Recursively get all files from a directory.
 * Returns parsed structure ready for upload.
 */
function getAllFiles(dir: string, baseDir: string = dir): FileEntry[] {
  const files: FileEntry[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else {
        const key = relative(baseDir, fullPath).replace(/\\/g, '/');
        files.push({ fullPath, key });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * Upload a single file to S3.
 * Fail fast with descriptive errors.
 */
async function uploadFile(file: FileEntry): Promise<void> {
  const { fullPath, key } = file;
  const contentType = getContentType(fullPath);
  const fileContent = readFileSync(fullPath);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000',
  });
  
  await s3Client.send(command);
}

/**
 * Main upload function.
 * Pure orchestration - no hidden mutations.
 */
async function uploadPublicToS3(): Promise<void> {
  console.log('🚀 Starting S3 upload from /public directory...\n');
  console.log(`📁 Source: ${PUBLIC_DIR}`);
  console.log(`🪣 Bucket: ${BUCKET_NAME}`);
  console.log(`🌐 Endpoint: https://fsn1.your-objectstorage.com\n`);
  
  const files = getAllFiles(PUBLIC_DIR);
  
  if (files.length === 0) {
    console.log('⚠️  No files found in /public directory');
    return;
  }
  
  console.log(`📦 Found ${files.length} files to upload\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const file of files) {
    try {
      await uploadFile(file);
      console.log(`✅ ${file.key}`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${file.key}`);
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}`);
        console.error(`   Stack: ${error.stack}`);
      } else {
        console.error(`   Error:`, JSON.stringify(error, null, 2));
      }
      failureCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Uploaded: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Total: ${files.length}`);
  console.log('='.repeat(50));
  
  if (failureCount > 0) {
    throw new Error(`Upload completed with ${failureCount} failures`);
  }
  
  console.log(`\n🎉 All files uploaded successfully!`);
  console.log(`🌍 CDN URL: ${process.env.NEXT_PUBLIC_CDN_URL}`);
}

// Execute
uploadPublicToS3().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
