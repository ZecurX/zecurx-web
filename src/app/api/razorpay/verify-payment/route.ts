import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dev_mode, metadata } = body;

        // DEV MODE: Skip signature verification
        const isDevMode = dev_mode === true && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

        // Validate required fields (skip for dev mode)
        if (!isDevMode && (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
            return NextResponse.json(
                { success: false, error: 'Missing required payment verification fields' },
                { status: 400 }
            );
        }

        if (!isDevMode) {
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
        }

        // Payment verified successfully (or dev mode)

        // Save to Database
        try {
            const { supabase } = await import("@/lib/supabase");
            let notes: Record<string, string> | undefined;
            let amountInRupees: number;

            if (isDevMode && metadata) {
                // DEV MODE: Use metadata from request body directly
                notes = metadata;
                amountInRupees = 1; // Default test amount
            } else {
                // PRODUCTION: Fetch order details from Razorpay
                const { getRazorpay } = await import("@/lib/razorpay");
                const order = await getRazorpay().orders.fetch(razorpay_order_id);

                if (!order) {
                    throw new Error('Order not found');
                }

                notes = order.notes as Record<string, string> | undefined;
                amountInRupees = Number(order.amount) / 100;
            }

            if (notes && notes.email) {

                // 1. Upsert Customer (by email) -> Returns ID
                const { data: customer, error: customerError } = await supabase
                    .from('customers')
                    .upsert({
                        email: notes.email,
                        name: notes.name,
                        phone: notes.mobile || notes.phone, // Support both field names
                        whatsapp: notes.whatsapp,
                        college: notes.college
                    }, { onConflict: 'email' })
                    .select()
                    .single();

                if (customerError) throw new Error('Customer DB Error: ' + customerError.message);
                if (!customer) throw new Error('Failed to save customer');

                // 2. Look up the Plan by itemName (this could be the course/internship title)
                let planId = notes.planId || null;
                if (!planId && notes.itemName) {
                    // Try to find a plan that matches the item name
                    const { data: plan } = await supabase
                        .from('plans')
                        .select('id')
                        .eq('name', notes.itemName)
                        .single();

                    if (plan) planId = plan.id;
                }

                // 3. Insert Transaction
                const { error: txError } = await supabase.from('transactions').insert({
                    payment_id: razorpay_payment_id,
                    order_id: razorpay_order_id,
                    amount: amountInRupees,
                    status: 'captured',
                    customer_id: customer.id,
                    plan_id: planId
                });

                if (txError) console.error('Transaction DB Error:', txError);
            }
        } catch (dbError) {
            console.error('Database Sync Failed:', dbError);
            // We don't fail the verification if DB save fails, but we log it.
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
