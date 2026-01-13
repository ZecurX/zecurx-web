import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requirePermission } from '@/lib/auth';
import { isImageUsedInPosts } from '@/lib/blog';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * POST /api/admin/blog/upload
 * Upload an image to Supabase Storage (blog-images bucket)
 * Requires: blog:create permission (marketing only)
 * 
 * Expects multipart/form-data with 'file' field
 * Returns: { url: string } - Public URL of uploaded image
 */
export async function POST(request: NextRequest) {
  const authResult = await requirePermission('blog', 'create', request);
  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);

    return NextResponse.json({ 
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/blog/upload
 * Delete an image from Supabase Storage
 * Requires: blog:delete permission (marketing only)
 * 
 * Expects JSON body: { url: string }
 * Note: Will NOT delete if image is currently used in any blog posts
 */
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

    // Check if image is used in any posts
    const isUsed = await isImageUsedInPosts(supabase, url);

    if (isUsed) {
      return NextResponse.json({ 
        error: 'Cannot delete image that is currently used in blog posts' 
      }, { status: 400 });
    }

    // Extract filename from URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/blog-images/<filename>
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];

    if (!filename) {
      return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('blog-images')
      .remove([filename]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
