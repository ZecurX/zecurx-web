const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
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

// Images actually used in the codebase
const USED_ASSETS = [
  'logo_new.png',
  'grid.svg',
  'images/zecurx-logo.png',
  'assets/icons/enterprise.svg',
  'assets/icons/gov.svg',
  'assets/icons/edu.svg',
  'assets/icons/tech.svg',
  'assets/icons/security.svg',
  'assets/icons/dev.svg',
  'assets/icons/ai.svg',
  'assets/light-bg.png',
  'assets/dark-bg.png',
  'images/pages/threat-intelligence.jpeg',
  'images/pages/compliance.jpeg',
  'images/pages/security-automation.jpeg',
  'images/pages/cloud-security-solution.jpeg',
  'images/pages/zero-trust.jpeg',
  'images/pages/identity-security.jpeg',
  'images/pages/ransomware-defense.jpeg',
  'images/pages/digital-transformation.jpeg',
  'images/pages/ai-powered-soc.jpeg',
  'images/pages/endpoint-security.jpeg',
  'images/pages/data-protection.jpeg',
  'images/pages/cloud-security.jpeg',
  'images/pages/application-security.jpeg',
  'images/pages/ai-detection.jpeg',
  // PDFs
  'brochures/Course_Brochure_zxCCE.pdf',
  'brochures/Course_Brochure_zxCCF.pdf',
  'brochures/Course_Brochure_zxCCP.pdf',
  'brochures/zxCPEH_Brochure_v3.pdf',
  'brochures/zxCPPT_Brochure_v3.pdf',
  'brochures/services/penetration-testing.pdf',
  'brochures/services/red-teaming.pdf',
  'brochures/services/risk-audit.pdf',
  'brochures/services/security-ops.pdf',
  'brochures/services/compressed/penetration-testing.pdf',
  'brochures/services/compressed/red-teaming.pdf',
  'brochures/services/compressed/risk-audit.pdf',
  'brochures/services/compressed/security-ops.pdf',
];

async function listBucketObjects() {
  const objects = [];
  let continuationToken;
  do {
    const response = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
    }));
    if (response.Contents) objects.push(...response.Contents.map(o => o.Key));
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  return objects;
}

async function uploadFile(localPath, key) {
  const content = fs.readFileSync(localPath);
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: content,
    ContentType: mime.lookup(localPath) || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000',
    ACL: 'public-read',
  }));
}

async function deleteObject(key) {
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function run() {
  console.log('1. Listing current bucket objects...');
  const currentObjects = await listBucketObjects();
  console.log(`   Found ${currentObjects.length} objects in bucket\n`);

  console.log('2. Uploading PDFs...');
  const pdfs = USED_ASSETS.filter(a => a.endsWith('.pdf'));
  for (const pdf of pdfs) {
    const localPath = path.join(PUBLIC_DIR, pdf);
    if (fs.existsSync(localPath)) {
      try {
        await uploadFile(localPath, pdf);
        console.log(`   ✓ ${pdf}`);
      } catch (e) {
        console.log(`   ✗ ${pdf}: ${e.message}`);
      }
    } else {
      console.log(`   ⚠ ${pdf} not found locally`);
    }
  }

  console.log('\n3. Identifying unused objects...');
  const unused = currentObjects.filter(obj => !USED_ASSETS.includes(obj));
  console.log(`   Found ${unused.length} unused objects\n`);

  console.log('4. Deleting unused objects...');
  for (const key of unused) {
    try {
      await deleteObject(key);
      console.log(`   ✗ Deleted: ${key}`);
    } catch (e) {
      console.log(`   ⚠ Failed to delete ${key}: ${e.message}`);
    }
  }

  console.log('\n5. Final state:');
  const finalObjects = await listBucketObjects();
  console.log(`   ${finalObjects.length} objects in bucket`);
  console.log(`   URL: https://${BUCKET}.in-maa-1.linodeobjects.com/`);
}

run().catch(console.error);
