#!/usr/bin/env node

/**
 * S3 Asset Migration Script
 * Uploads large assets from public/ to Linode S3
 */

import { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Configuration
const S3_CONFIG = {
  endpoint: "https://in-maa-1.linodeobjects.com",
  region: "in-maa-1",
  credentials: {
    accessKeyId: "ZD9TOSVFHQDMDN7BF56B",
    secretAccessKey: "L766py5BC4i3hWh1WSGReQUfJ5HGzfVDvALG1qs5",
  },
};

const BUCKET = "zexc";
const CDN_URL = "https://zexc.in-maa-1.linodeobjects.com";
const MIN_FILE_SIZE = 100 * 1024; // 100KB threshold

// Folders to migrate
const FOLDERS_TO_MIGRATE = ["brochures", "images", "assets"];

// Files to keep in repo (small essential files)
const KEEP_IN_REPO = [
  "icons", // Keep all icons
  ".ico",
  ".svg",
];

// MIME types
const MIME_TYPES = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const s3Client = new S3Client(S3_CONFIG);

async function testConnection() {
  console.log("🔌 Testing S3 connection...");
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      MaxKeys: 1,
    });
    await s3Client.send(command);
    console.log("✅ S3 connection successful!\n");
    return true;
  } catch (error) {
    console.error("❌ S3 connection failed:", error.message);
    return false;
  }
}

async function checkIfExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function getAllFiles(dir, baseDir = dir) {
  const files = [];
  if (!existsSync(dir)) return files;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      const relativePath = relative(baseDir, fullPath);
      files.push({
        fullPath,
        relativePath,
        size: stat.size,
        ext: extname(item).toLowerCase(),
      });
    }
  }
  return files;
}

async function uploadFile(file, folder) {
  const key = `${folder}/${file.relativePath}`;
  const mimeType = MIME_TYPES[file.ext] || "application/octet-stream";

  // Check if already exists
  const exists = await checkIfExists(key);
  if (exists) {
    console.log(`  ⏭️  Skipped (exists): ${key}`);
    return { skipped: true, key };
  }

  const content = readFileSync(file.fullPath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: mimeType,
    ACL: "public-read",
    CacheControl: "public, max-age=31536000", // 1 year cache
  });

  await s3Client.send(command);
  console.log(`  ✅ Uploaded: ${key} (${(file.size / 1024).toFixed(1)}KB)`);
  return { uploaded: true, key };
}

async function migrateFolder(folder) {
  const publicPath = join(projectRoot, "public", folder);
  console.log(`\n📁 Processing: public/${folder}/`);

  if (!existsSync(publicPath)) {
    console.log(`  ⚠️  Folder does not exist, skipping`);
    return { uploaded: 0, skipped: 0, total: 0 };
  }

  const files = getAllFiles(publicPath);
  const largeFiles = files.filter((f) => f.size >= MIN_FILE_SIZE);

  console.log(`  Found ${files.length} files, ${largeFiles.length} are >= 100KB`);

  let uploaded = 0;
  let skipped = 0;

  for (const file of largeFiles) {
    try {
      const result = await uploadFile(file, folder);
      if (result.uploaded) uploaded++;
      if (result.skipped) skipped++;
    } catch (error) {
      console.error(`  ❌ Failed: ${file.relativePath} - ${error.message}`);
    }
  }

  return { uploaded, skipped, total: largeFiles.length };
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("           ZecurX Asset Migration to Linode S3");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`\nBucket: ${BUCKET}`);
  console.log(`CDN URL: ${CDN_URL}`);
  console.log(`Threshold: Files >= ${MIN_FILE_SIZE / 1024}KB will be uploaded\n`);

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }

  // Migrate each folder
  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalFiles = 0;

  for (const folder of FOLDERS_TO_MIGRATE) {
    const result = await migrateFolder(folder);
    totalUploaded += result.uploaded;
    totalSkipped += result.skipped;
    totalFiles += result.total;
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("                     Migration Complete");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Uploaded: ${totalUploaded}`);
  console.log(`Skipped (already exist): ${totalSkipped}`);
  console.log(`\n🔗 Access assets at: ${CDN_URL}/<folder>/<path>`);
  console.log("\nExample URLs:");
  console.log(`  ${CDN_URL}/brochures/zxCPPT_Brochure_v3.pdf`);
  console.log(`  ${CDN_URL}/images/features/ai-detection.png`);
  console.log(`  ${CDN_URL}/assets/dark-bg.png`);
}

main().catch(console.error);
