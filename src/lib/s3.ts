import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.LINODE_S3_ENDPOINT || 'https://in-maa-1.linodeobjects.com',
  credentials: {
    accessKeyId: process.env.LINODE_S3_ACCESS_KEY || '',
    secretAccessKey: process.env.LINODE_S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.LINODE_S3_BUCKET || 'zexc';
export const S3_BASE_URL = `https://${BUCKET_NAME}.in-maa-1.linodeobjects.com`;

/**
 * Upload a file to Linode Object Storage
 */
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  options?: { cacheControl?: string; acl?: string }
): Promise<{ url: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: options?.cacheControl || 'public, max-age=31536000',
    ACL: 'public-read',
  });

  await s3Client.send(command);
  
  return {
    url: `${S3_BASE_URL}/${key}`,
    key,
  };
}

/**
 * Delete a file from Linode Object Storage
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * List files in a folder
 */
export async function listS3Files(prefix?: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map(obj => obj.Key || '') || [];
}

/**
 * Check if a file exists
 */
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get public URL for a file
 */
export function getS3Url(key: string): string {
  return `${S3_BASE_URL}/${key}`;
}

/**
 * Generate a unique filename with folder structure
 */
export function generateS3Key(filename: string, folder: string = 'images'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 50); // Limit length
  
  return `${folder}/${safeName}-${timestamp}-${randomStr}.${ext}`;
}
