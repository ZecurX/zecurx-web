import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { uploadToS3, generateS3Key } from '@/lib/s3';
import { getJwtSecret } from '@/lib/auth';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 50 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPES = ['application/pdf'];

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        try {
            await jwtVerify(session.value, getJwtSecret());
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = (formData.get('type') as string) || 'logo';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const isLogo = type === 'logo';
        const allowedTypes = isLogo ? ALLOWED_IMAGE_TYPES : ALLOWED_PDF_TYPES;
        const maxSize = isLogo ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;
        const folder = isLogo ? 'images/courses' : 'brochures';

        if (!allowedTypes.includes(file.type)) {
            const typeLabel = isLogo ? 'JPEG, PNG, WebP' : 'PDF';
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${typeLabel}` },
                { status: 400 }
            );
        }

        if (file.size > maxSize) {
            const limitMB = maxSize / (1024 * 1024);
            return NextResponse.json(
                { error: `File too large. Maximum size is ${limitMB}MB` },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const key = generateS3Key(file.name, folder);

        const result = await uploadToS3(buffer, key, file.type);

        return NextResponse.json({ url: result.url, key: result.key });
    } catch (error) {
        console.error('Plan upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
