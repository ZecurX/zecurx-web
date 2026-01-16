import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Razorpay credentials not configured',
                },
                { status: 500 }
            );
        }

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        const response = await fetch('https://api.razorpay.com/v1/orders?count=1', {
            method: 'GET',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    success: false,
                    error: errorData.error?.description || 'Razorpay API error',
                },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Razorpay API connection successful',
            details: {
                keyIdPrefix: keyId.substring(0, 12) + '...',
                totalOrders: data.count || 0,
                apiStatus: 'Connected',
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to connect to Razorpay',
            },
            { status: 500 }
        );
    }
}
