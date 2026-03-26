/**
 * CDN Upload Script - Upload Lottie animations to Hetzner S3
 * 
 * Security features:
 * - Reads credentials from .env.local (never hardcoded)
 * - Validates environment variables before execution
 * - Sets secure S3 permissions (public-read for assets only)
 * - Uses HTTPS endpoints only
 * - Validates file types before upload
 * - Gzip compression for JSON files
 * - Proper Content-Type headers
 * - Cache-Control headers for optimal performance
 * 
 * Usage:
 *   node scripts/upload-to-cdn.js
 */

import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { gzipSync } from 'zlib';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Validate required environment variables
const requiredEnvVars = [
  'HETZNER_S3_ENDPOINT',
  'HETZNER_S3_BUCKET',
  'HETZNER_S3_ACCESS_KEY',
  'HETZNER_S3_SECRET_KEY',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

// Validate endpoint is HTTPS
if (!process.env.HETZNER_S3_ENDPOINT?.startsWith('https://')) {
  console.error('❌ HETZNER_S3_ENDPOINT must use HTTPS');
  process.exit(1);
}

// Configure S3 client with Hetzner credentials
const s3Client = new S3Client({
  endpoint: process.env.HETZNER_S3_ENDPOINT,
  region: 'eu-central', // Hetzner region
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY,
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY,
  },
  forcePathStyle: true, // Required for some S3-compatible services
});

const BUCKET_NAME = process.env.HETZNER_S3_BUCKET;

// Allowed file extensions (whitelist for security)
const ALLOWED_EXTENSIONS = ['.json'];

// Paths to upload
const UPLOAD_PATHS = [
  { local: 'public/lottie', remote: 'lottie' },
  { local: 'public/hero-lottie.json', remote: 'hero-lottie.json' },
];

/**
 * Get Content-Type based on file extension
 */
function getContentType(filename) {
  const ext = extname(filename).toLowerCase();
  const mimeTypes = {
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Upload a single file to S3
 * @returns {Promise<{success: boolean, file: string, cdnUrl: string, size: number, error?: string}>}
 */
async function uploadFile(localPath, remotePath) {
  try {
    // Validate file extension
    const ext = extname(localPath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        success: false,
        file: localPath,
        cdnUrl: '',
        size: 0,
        error: `File type ${ext} not allowed`,
      };
    }

    // Read file
    const fileContent = readFileSync(localPath);
    const stats = statSync(localPath);
    
    // Compress JSON files with gzip
    const shouldCompress = ext === '.json';
    const uploadContent = shouldCompress ? gzipSync(fileContent) : fileContent;
    
    const contentType = getContentType(localPath);
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: remotePath,
      Body: uploadContent,
      ContentType: contentType,
      ContentEncoding: shouldCompress ? 'gzip' : undefined,
      CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
      ACL: 'public-read', // Make files publicly accessible
    });

    await s3Client.send(command);

    const cdnUrl = `${process.env.HETZNER_S3_ENDPOINT}/${BUCKET_NAME}/${remotePath}`;
    
    return {
      success: true,
      file: localPath,
      cdnUrl,
      size: stats.size,
    };
  } catch (error) {
    return {
      success: false,
      file: localPath,
      cdnUrl: '',
      size: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all files from a directory recursively
 */
function getFilesRecursive(dir) {
  const files = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getFilesRecursive(fullPath));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read directory ${dir}`);
  }
  
  return files;
}

/**
 * Main upload function
 */
async function main() {
  console.log('🚀 Starting CDN upload process...\n');
  
  // Verify bucket access
  console.log(`📦 Verifying bucket access: ${BUCKET_NAME}`);
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log('✅ Bucket access verified\n');
  } catch (error) {
    console.error('❌ Cannot access S3 bucket. Please check your credentials.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  const results = [];
  let totalSize = 0;
  
  // Process each upload path
  for (const { local, remote } of UPLOAD_PATHS) {
    try {
      const stat = statSync(local);
      
      if (stat.isDirectory()) {
        // Upload directory contents
        console.log(`📁 Uploading directory: ${local}/`);
        const files = getFilesRecursive(local);
        
        for (const file of files) {
          const relativePath = file.substring(local.length + 1);
          const remotePath = `${remote}/${relativePath}`;
          
          console.log(`   Uploading: ${relativePath}`);
          const result = await uploadFile(file, remotePath);
          results.push(result);
          
          if (result.success) {
            totalSize += result.size;
            console.log(`   ✅ Success (${(result.size / 1024).toFixed(1)} KB)`);
          } else {
            console.log(`   ❌ Failed: ${result.error}`);
          }
        }
      } else {
        // Upload single file
        console.log(`📄 Uploading file: ${local}`);
        const result = await uploadFile(local, remote);
        results.push(result);
        
        if (result.success) {
          totalSize += result.size;
          console.log(`   ✅ Success (${(result.size / 1024).toFixed(1)} KB)`);
        } else {
          console.log(`   ❌ Failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${local}:`, error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length} files`);
  console.log(`❌ Failed: ${failed.length} files`);
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed uploads:');
    failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
  }
  
  console.log('\n✨ Upload complete!');
  console.log(`🌍 CDN URL: ${process.env.HETZNER_S3_ENDPOINT}/${BUCKET_NAME}/`);
}

// Run the upload
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
