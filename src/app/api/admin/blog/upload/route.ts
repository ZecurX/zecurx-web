import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { uploadToS3, deleteFromS3, generateS3Key, S3_BASE_URL } from '@/lib/s3';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  const authResult = await requirePermission('blog', 'create', request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' 
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = generateS3Key(file.name, 'blog');

    const result = await uploadToS3(buffer, key, file.type);

    return NextResponse.json({ 
      url: result.url,
      filename: result.key,
      size: file.size,
      type: file.type
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requirePermission('blog', 'delete', request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const result = await query(
      `SELECT COUNT(*) as count FROM blog_posts WHERE content LIKE $1 OR featured_image_url = $2`,
      [`%${url}%`, url]
    );
    const isUsed = parseInt(result.rows[0]?.count || '0') > 0;

    if (isUsed) {
      return NextResponse.json({ 
        error: 'Cannot delete image that is currently used in blog posts' 
      }, { status: 400 });
    }

    const key = url.replace(S3_BASE_URL + '/', '');

    if (!key) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    await deleteFromS3(key);

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
