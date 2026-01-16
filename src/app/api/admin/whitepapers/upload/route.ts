import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { uploadToS3, deleteFromS3, generateS3Key, S3_BASE_URL } from '@/lib/s3';
import { query } from '@/lib/db';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

export async function POST(request: NextRequest) {
  const authResult = await requirePermission('whitepapers', 'create', request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isPdf = fileType === 'pdf' || ALLOWED_PDF_TYPES.includes(file.type);
    const isImage = fileType === 'image' || ALLOWED_IMAGE_TYPES.includes(file.type);

    if (!isPdf && !isImage) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed types: PDF, JPEG, PNG, GIF, WebP' 
      }, { status: 400 });
    }

    const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${isPdf ? '50MB' : '5MB'}` 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const folder = isPdf ? 'whitepapers/pdfs' : 'whitepapers/covers';
    const key = generateS3Key(file.name, folder);

    const result = await uploadToS3(buffer, key, file.type);

    return NextResponse.json({ 
      url: result.url,
      filename: result.key,
      size: file.size,
      type: file.type,
      isPdf,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requirePermission('whitepapers', 'delete', request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    const result = await query(
      `SELECT COUNT(*) as count FROM whitepapers WHERE pdf_url = $1 OR cover_image_url = $2`,
      [url, url]
    );
    const isUsed = parseInt(result.rows[0]?.count || '0') > 0;

    if (isUsed) {
      return NextResponse.json({ 
        error: 'Cannot delete file that is currently used in whitepapers' 
      }, { status: 400 });
    }

    const key = url.replace(S3_BASE_URL + '/', '');

    if (!key) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
    }

    await deleteFromS3(key);

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
