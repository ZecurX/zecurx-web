#!/usr/bin/env node
/**
 * Image Optimization Script
 * Compresses PNG/JPG images in the public folder using sharp
 * Run with: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { existsSync } from 'fs';

const PUBLIC_DIR = './public';
const QUALITY = 80; // PNG/JPEG quality (0-100)
const MAX_WIDTH = 1920; // Max width for feature images

// Directories to process
const DIRS_TO_PROCESS = [
  'public/images',
  'public/images/features',
  'public/assets',
];

// Files to skip (already optimized or need to stay high quality)
const SKIP_FILES = [
  'favicon',
  'apple-touch-icon',
  'android-chrome',
  'og-',
];

async function getFilesRecursive(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...await getFilesRecursive(fullPath));
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  
  return files;
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath);
  
  // Skip certain files
  if (SKIP_FILES.some(skip => name.toLowerCase().includes(skip))) {
    console.log(`⏭️  Skipping: ${filePath}`);
    return { skipped: true };
  }
  
  try {
    const originalStats = await stat(filePath);
    const originalSize = originalStats.size;
    
    // Skip if already small (under 100KB)
    if (originalSize < 100 * 1024) {
      console.log(`✓  Already optimized: ${filePath} (${(originalSize / 1024).toFixed(1)}KB)`);
      return { skipped: true };
    }
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Resize if too large
    let pipeline = image;
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    // Compress based on format
    let buffer;
    if (ext === '.png') {
      buffer = await pipeline
        .png({
          quality: QUALITY,
          compressionLevel: 9,
          palette: true,
          effort: 10,
        })
        .toBuffer();
    } else {
      buffer = await pipeline
        .jpeg({
          quality: QUALITY,
          mozjpeg: true,
        })
        .toBuffer();
    }
    
    // Only save if smaller
    if (buffer.length < originalSize * 0.9) {
      await sharp(buffer).toFile(filePath);
      const savings = ((originalSize - buffer.length) / originalSize * 100).toFixed(1);
      console.log(`✅ Optimized: ${filePath}`);
      console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(buffer.length / 1024).toFixed(1)}KB (${savings}% saved)`);
      return { 
        optimized: true, 
        originalSize, 
        newSize: buffer.length,
        savings: originalSize - buffer.length 
      };
    } else {
      console.log(`⚖️  No improvement: ${filePath}`);
      return { skipped: true };
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
    return { error: true };
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('Settings:');
  console.log(`  Quality: ${QUALITY}`);
  console.log(`  Max Width: ${MAX_WIDTH}px\n`);
  
  let totalOriginal = 0;
  let totalNew = 0;
  let optimizedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const dir of DIRS_TO_PROCESS) {
    if (!existsSync(dir)) {
      console.log(`Directory not found: ${dir}`);
      continue;
    }
    
    console.log(`\n📁 Processing: ${dir}\n`);
    const files = await getFilesRecursive(dir);
    
    for (const file of files) {
      const result = await optimizeImage(file);
      
      if (result.optimized) {
        optimizedCount++;
        totalOriginal += result.originalSize;
        totalNew += result.newSize;
      } else if (result.error) {
        errorCount++;
      } else {
        skippedCount++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Optimized: ${optimizedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   Errors: ${errorCount} files`);
  
  if (optimizedCount > 0) {
    const totalSavings = totalOriginal - totalNew;
    console.log(`\n💾 Total Savings: ${(totalSavings / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
  }
}

main().catch(console.error);
