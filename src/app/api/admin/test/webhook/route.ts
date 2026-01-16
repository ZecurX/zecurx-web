import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zecurx.com';

        const webhookUrl = `${baseUrl}/api/razorpay/webhook`;

        const response = await fetch(webhookUrl, {
            method: 'GET',
        });

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Webhook endpoint returned ${response.status}`,
                },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            message: 'Webhook endpoint is active',
            details: {
                endpoint: webhookUrl,
                status: data.status,
                supportedEvents: data.supportedEvents,
                secretConfigured: !!webhookSecret,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to test webhook',
            },
            { status: 500 }
        );
    }
}
