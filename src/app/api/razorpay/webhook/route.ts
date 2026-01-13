import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { appendToSheet } from '@/lib/google-sheets';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

function verifyWebhookSignature(body: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
        console.error('RAZORPAY_WEBHOOK_SECRET not configured');
        return false;
    }
    
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            console.error('Webhook: Missing signature header');
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error('Webhook: Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const eventType = event.event;

        console.log(`Webhook received: ${eventType}`);

        if (eventType === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;
            const amount = payment.amount / 100;
            const notes = payment.notes || {};

            console.log(`Payment captured: ${paymentId}, Amount: ₹${amount}`);

            const { supabase } = await import('@/lib/supabase');

            if (notes.email) {
                const { data: customer, error: customerError } = await supabase
                    .from('customers')
                    .upsert({
                        email: notes.email,
                        name: notes.name,
                        phone: notes.mobile || notes.phone,
                        whatsapp: notes.whatsapp,
                        college: notes.college
                    }, { onConflict: 'email' })
                    .select()
                    .single();

                if (customerError) {
                    console.error('Webhook: Customer DB Error:', customerError.message);
                }

                if (customer) {
                    let planId = notes.planId || null;
                    if (!planId && notes.itemName) {
                        const { data: plan } = await supabase
                            .from('plans')
                            .select('id')
                            .eq('name', notes.itemName)
                            .single();
                        if (plan) planId = plan.id;
                    }

                    const { error: txError } = await supabase.from('transactions').insert({
                        payment_id: paymentId,
                        order_id: orderId,
                        amount: amount,
                        status: 'captured',
                        customer_id: customer.id,
                        plan_id: planId
                    });

                    if (txError) {
                        console.error('Webhook: Transaction DB Error:', txError.message);
                    }
                }

                const isInternship = notes.itemName?.toLowerCase().includes('internship');

                if (isInternship) {
                    try {
                        await appendToSheet({
                            name: notes.name || '',
                            email: notes.email,
                            mobile: notes.mobile || notes.phone || '',
                            college: notes.college || '',
                            course: notes.itemName || 'Unknown',
                            price: amount,
                            paymentId: paymentId,
                            date: new Date().toISOString()
                        });
                        console.log('Webhook: Appended to Google Sheets');
                    } catch (sheetError) {
                        console.error('Webhook: Google Sheets Error:', sheetError);
                    }
                }

                try {
                    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zecurx.com';
                    await fetch(`${baseUrl}/api/send-email`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: notes.name,
                            email: notes.email,
                            formType: 'purchase',
                            itemName: notes.itemName,
                            price: amount,
                            paymentId: paymentId,
                            mobile: notes.mobile || notes.phone,
                            college: notes.college
                        })
                    });
                    console.log('Webhook: Triggered send-email API');
                } catch (emailError) {
                    console.error('Webhook: Email trigger failed:', emailError);
                }
            }
        }

        if (eventType === 'payment.failed') {
            const payment = event.payload.payment.entity;
            console.log(`Payment failed: ${payment.id}, Reason: ${payment.error_description}`);
        }

        if (eventType === 'refund.created') {
            const refund = event.payload.refund.entity;
            console.log(`Refund created: ${refund.id}, Amount: ₹${refund.amount / 100}`);
            
            const { supabase } = await import('@/lib/supabase');
            await supabase
                .from('transactions')
                .update({ status: 'refunded' })
                .eq('payment_id', refund.payment_id);
        }

        return NextResponse.json({ received: true, event: eventType });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ 
        status: 'ok', 
        message: 'Razorpay webhook endpoint is active',
        supportedEvents: ['payment.captured', 'payment.failed', 'refund.created']
    });
}
