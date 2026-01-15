import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, generateS3Key } from '@/lib/s3';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'images';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max size: 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = generateS3Key(file.name, folder);
    
    const result = await uploadToS3(buffer, key, file.type);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
