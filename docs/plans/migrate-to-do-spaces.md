# Plan: Migrate from Supabase Storage to DigitalOcean Spaces

**Created**: 2026-01-15
**Status**: Pending
**Priority**: Medium

## Why

Currently using Supabase Storage only for image uploads (2 routes). Since we migrated the database to VPS PostgreSQL, Supabase is now an unnecessary dependency just for file storage.

DigitalOcean Spaces is S3-compatible with built-in CDN, and our VPS is already on DigitalOcean.

## Current State

### Files Using Supabase Storage

| File | Purpose |
|------|---------|
| `/src/lib/supabase-storage.ts` | Supabase client for storage |
| `/src/app/api/admin/upload/route.ts` | Admin product image uploads |
| `/src/app/api/admin/blog/upload/route.ts` | Blog post image uploads |

### Current Supabase ENV Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://focncjvcgoyolzlrobli.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (unused)
```

## Migration Steps

### Step 1: Create DigitalOcean Space

1. Go to DigitalOcean Console > Spaces
2. Create new Space:
   - Name: `zecurx-assets`
   - Region: `blr1` (Bangalore) or `sgp1` (Singapore)
   - Enable CDN
3. Go to API > Spaces Keys
4. Generate new key pair (Access Key + Secret)

### Step 2: Install AWS S3 SDK

```bash
npm install @aws-sdk/client-s3
```

### Step 3: Create New Storage Utility

Create `/src/lib/storage.ts`:

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: process.env.DO_SPACES_REGION!,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

const BUCKET = process.env.DO_SPACES_BUCKET!;
const CDN_URL = process.env.DO_SPACES_CDN_URL!;

export async function uploadFile(
  buffer: Buffer,
  path: string,
  contentType: string
): Promise<{ url: string; error: Error | null }> {
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: path,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    }));
    
    return { url: `${CDN_URL}/${path}`, error: null };
  } catch (error) {
    return { url: '', error: error as Error };
  }
}

export async function deleteFile(path: string): Promise<{ error: Error | null }> {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: path,
    }));
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}
```

### Step 4: Update Upload Routes

Update both routes to use new storage utility instead of supabaseStorage.

**`/src/app/api/admin/upload/route.ts`** - Replace:
- `import { supabaseStorage }` with `import { uploadFile }`
- `supabaseStorage.storage.from().upload()` with `uploadFile()`

**`/src/app/api/admin/blog/upload/route.ts`** - Same changes

### Step 5: Add New ENV Variables

```env
# DigitalOcean Spaces
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_BUCKET=zecurx-assets
DO_SPACES_REGION=blr1
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_CDN_URL=https://zecurx-assets.blr1.cdn.digitaloceanspaces.com
```

### Step 6: Remove Supabase Completely

1. Delete `/src/lib/supabase-storage.ts`
2. Remove from `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Uninstall package:
   ```bash
   npm uninstall @supabase/supabase-js
   ```

### Step 7: Remove Unused SMTP Variables

Also remove these (using Resend now):
- `SMTP_EMAIL`
- `SMTP_PASSWORD`
- `SMTP_OFFICIAL_EMAIL`
- `SMTP_OFFICIAL_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`

## Final ENV File (After Migration)

```env
# Admin Auth
ADMIN_PASSWORD=zecurx-admin-2025

# Dev Mode Toggle
NEXT_PUBLIC_DEV_MODE=false

# Google Sheets (Internship Forms)
GOOGLE_SHEETS_CLIENT_EMAIL=zecurx-sheets@intern-mail.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
GOOGLE_SHEET_ID=18CcfbjixeS-yKQYD3Vu2C0M8CCfoxrTgBDysJSauuh4

# ZecurX API
ZECURX_API_KEY=925ea39b5c5c4cb138dd108b2e6ade6e8d4fd7105631abd57ce15bc8c266ca62

# Razorpay
RAZORPAY_KEY_ID=rzp_live_S0pJRD9qni29vp
RAZORPAY_KEY_SECRET=qffzGoRTBuE9k3ouTTgHfNVt
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_S0pJRD9qni29vp
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_S0pJRD9qni29vpabyezx

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.zecurx.com

# PostgreSQL Database (VPS)
DATABASE_URL=postgresql://zecurx:zecurxdb2026@209.38.155.227:5432/zecurx_platform?schema=zecurx_admin

# Email (Resend)
RESEND_API_KEY=re_CK8GBv5N_2yGwgR8NizSjshL3WGdHis2F

# DigitalOcean Spaces (NEW)
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_BUCKET=zecurx-assets
DO_SPACES_REGION=blr1
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_CDN_URL=https://zecurx-assets.blr1.cdn.digitaloceanspaces.com
```

## Existing Images

After migration, existing images on Supabase will still work (URLs won't change). New uploads will go to DO Spaces.

If you want to migrate existing images:
1. Download from Supabase Storage
2. Upload to DO Spaces with same paths
3. Update database URLs (optional - old URLs keep working)

## Estimated Time

- Setup: 15 minutes
- Code changes: 30 minutes
- Testing: 15 minutes
- Total: ~1 hour
