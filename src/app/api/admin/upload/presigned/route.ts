import { NextRequest, NextResponse } from 'next/server';
import { getSignedUploadUrl, generateS3Key } from '@/lib/s3';

export async function POST(req: NextRequest) {
  // DEBUG
  console.log('Presigned URL request received');
  try {
    const body = await req.json();
    console.log('Request body:', body);
    if (!process.env.HETZNER_S3_ACCESS_KEY || !process.env.HETZNER_S3_SECRET_KEY) {
      console.error('S3 Credentials missing in process.env');
      return NextResponse.json({ 
        error: 'S3 Configuration Error', 
        details: 'Server is missing storage credentials' 
      }, { status: 500 });
    }

    const { filename, contentType, folder } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
    }

    const key = generateS3Key(filename, folder || 'uploads');
    const data = await getSignedUploadUrl(key, contentType);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Presigned URL error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate upload URL',
      details: error.message,
      code: error.code || error.name
    }, { status: 500 });
  }
}
