import { NextRequest, NextResponse } from 'next/server';
import { getSignedUploadUrl, generateS3Key } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, folder } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
    }

    const key = generateS3Key(filename, folder || 'uploads');
    const data = await getSignedUploadUrl(key, contentType);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
