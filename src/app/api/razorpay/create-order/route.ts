import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, amountToPaise, CURRENCY } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, courseId, courseName } = body;

        // Validate required fields
        if (!amount || !courseId || !courseName) {
            return NextResponse.json(
                { error: 'Missing required fields: amount, courseId, courseName' },
                { status: 400 }
            );
        }

        // Validate amount is positive
        if (amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be greater than 0' },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const order = await getRazorpay().orders.create({
            amount: amountToPaise(amount),
            currency: CURRENCY,
            receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`,
            notes: {
                courseId,
                courseName,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            courseName,
            courseId,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}
