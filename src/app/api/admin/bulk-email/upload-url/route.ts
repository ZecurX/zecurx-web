import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { RESOURCES, ACTIONS } from '@/types/auth';
import { s3Client, BUCKET_NAME, generateS3Key, getS3Url } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Returns a presigned PUT URL so the browser can upload an attachment directly
// to Hetzner Object Storage, bypassing Vercel's 4.5 MB function payload limit.
// NOTE: the Hetzner bucket needs a CORS rule that allows PUT from the app origin:
//   AllowedOrigins: ["https://www.zecurx.com"], AllowedMethods: ["PUT"],
//   AllowedHeaders: ["*"], ExposeHeaders: ["ETag"]
export async function GET(req: NextRequest) {
    const auth = await requirePermission(RESOURCES.BULK_EMAIL, ACTIONS.CREATE, req);
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const params = req.nextUrl.searchParams;
    const filename = params.get('filename') ?? 'file';
    const type = params.get('type') ?? 'application/octet-stream';

    try {
        const key = generateS3Key(filename, 'bulk-email-temp');
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: type,
        });
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
        return NextResponse.json({ uploadUrl, publicUrl: getS3Url(key), key });
    } catch (error) {
        console.error('Failed to generate presigned upload URL:', error);
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }
}
