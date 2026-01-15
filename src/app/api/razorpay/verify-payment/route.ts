import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dev_mode, metadata } = body;

        const isDevMode = dev_mode === true && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

        if (!isDevMode && (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        if (!isDevMode) {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (!secret) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification configuration error' },
                    { status: 500 }
                );
            }

            const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return NextResponse.json(
                    { success: false, error: 'Payment verification failed - invalid signature' },
                    { status: 400 }
                );
            }
        }

        try {
            let notes: Record<string, string> | undefined;
            let amountInRupees: number;

            if (isDevMode && metadata) {
                notes = metadata;
                amountInRupees = 1;
            } else {
                const { getRazorpay } = await import("@/lib/razorpay");
                const order = await getRazorpay().orders.fetch(razorpay_order_id);

                if (!order) {
                    throw new Error('Order not found');
                }

                notes = order.notes as Record<string, string> | undefined;
                amountInRupees = Number(order.amount) / 100;
            }

            if (notes && notes.email) {
                const customerResult = await query(`
                    INSERT INTO customers (email, name, phone, whatsapp, college)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (email) 
                    DO UPDATE SET 
                        name = COALESCE(EXCLUDED.name, customers.name),
                        phone = COALESCE(EXCLUDED.phone, customers.phone),
                        whatsapp = COALESCE(EXCLUDED.whatsapp, customers.whatsapp),
                        college = COALESCE(EXCLUDED.college, customers.college),
                        updated_at = NOW()
                    RETURNING *
                `, [
                    notes.email,
                    notes.name || null,
                    notes.mobile || notes.phone || null,
                    notes.whatsapp || null,
                    notes.college || null
                ]);

                const customer = customerResult.rows[0];
                if (!customer) throw new Error('Failed to save customer');

                let planId = notes.planId || null;
                if (!planId && notes.itemName) {
                    const planResult = await query(
                        'SELECT id FROM plans WHERE name = $1 LIMIT 1',
                        [notes.itemName]
                    );
                    if (planResult.rows.length > 0) {
                        planId = planResult.rows[0].id;
                    }
                }

                try {
                    await query(`
                        INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                    `, [razorpay_payment_id, razorpay_order_id, amountInRupees, 'captured', customer.id, planId]);
                } catch (txError) {
                    console.error('Transaction DB Error:', txError);
                }
            }
        } catch (dbError) {
            console.error('Database Sync Failed:', dbError);
        }

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
