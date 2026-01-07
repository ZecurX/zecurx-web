import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        // Verify signature using HMAC SHA256
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json(
                { success: false, error: 'Payment verification configuration error' },
                { status: 500 }
            );
        }

        // Create the expected signature
        const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        // Compare signatures
        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Payment verification failed - invalid signature' },
                { status: 400 }
            );
        }

        // Payment verified successfully
        // TODO: Store payment record in database
        // TODO: Grant course access to user

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { success: false, error: 'Payment verification failed. Please contact support.' },
            { status: 500 }
        );
    }
}
