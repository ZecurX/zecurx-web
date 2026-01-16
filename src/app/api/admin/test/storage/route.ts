import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function POST() {
    try {
        const accessKeyId = process.env.LINODE_ACCESS_KEY_ID;
        const secretAccessKey = process.env.LINODE_SECRET_ACCESS_KEY;
        const endpoint = process.env.LINODE_S3_ENDPOINT;
        const bucket = process.env.LINODE_S3_BUCKET;

        if (!accessKeyId || !secretAccessKey || !endpoint || !bucket) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'S3 storage credentials not fully configured',
                    details: {
                        accessKeyConfigured: !!accessKeyId,
                        secretKeyConfigured: !!secretAccessKey,
                        endpointConfigured: !!endpoint,
                        bucketConfigured: !!bucket,
                    },
                },
                { status: 500 }
            );
        }

        const s3Client = new S3Client({
            region: 'in-maa-1',
            endpoint: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });

        const command = new ListObjectsV2Command({
            Bucket: bucket,
            MaxKeys: 5,
        });

        const response = await s3Client.send(command);

        return NextResponse.json({
            success: true,
            message: 'S3 storage connection successful',
            details: {
                bucket,
                endpoint,
                objectCount: response.KeyCount || 0,
                sampleFiles: response.Contents?.slice(0, 5).map((obj) => obj.Key) || [],
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to connect to S3 storage',
            },
            { status: 500 }
        );
    }
}
