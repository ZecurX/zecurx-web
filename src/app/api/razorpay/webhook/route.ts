import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { appendToSheet } from '@/lib/google-sheets';
import { query } from '@/lib/db';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice';
import { Resend } from 'resend';

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

async function sendInvoiceEmail(data: {
    name: string;
    email: string;
    itemName: string;
    amount: number;
    paymentId: string;
    orderId: string;
    phone?: string;
    college?: string;
    isInternship: boolean;
}): Promise<void> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const invoiceNumber = generateInvoiceNumber();
    
    const invoicePdf = await generateInvoicePDF({
        invoiceNumber,
        date: new Date(),
        customerName: data.name || 'Customer',
        customerEmail: data.email,
        customerPhone: data.phone,
        customerCollege: data.college,
        itemName: data.itemName,
        itemDescription: data.isInternship 
            ? 'Professional internship program with hands-on training and certification'
            : undefined,
        amount: data.amount,
        paymentId: data.paymentId,
        orderId: data.orderId,
    });

    const adminEmail = data.isInternship ? 'zecurxintern@gmail.com' : 'official@zecurx.com';
    
    const emailSubject = data.isInternship
        ? `Enrollment Confirmed: ${data.itemName} - ZecurX`
        : `Order Confirmation: ${data.itemName} - ZecurX`;

    const userEmailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">ZECURX</h1>
                <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 14px;">Cybersecurity Solutions</p>
            </div>
            
            <div style="padding: 40px 30px;">
                <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">
                    ${data.isInternship ? '🎓 Welcome to the Program!' : '✅ Order Confirmed!'}
                </h2>
                
                <p style="color: #555; line-height: 1.7; margin-bottom: 25px;">
                    Hi <strong>${data.name || 'there'}</strong>,<br><br>
                    ${data.isInternship 
                        ? `Congratulations on enrolling in <strong>${data.itemName}</strong>! Your journey into cybersecurity excellence begins now.`
                        : `Thank you for your purchase of <strong>${data.itemName}</strong>. Your order has been confirmed.`
                    }
                </p>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
                        Order Summary
                    </h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Item:</td>
                            <td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 500;">${data.itemName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
                            <td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 600; font-size: 18px;">₹${data.amount.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Payment ID:</td>
                            <td style="padding: 8px 0; color: #666; text-align: right; font-family: monospace; font-size: 12px;">${data.paymentId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #666;">Status:</td>
                            <td style="padding: 8px 0; text-align: right;">
                                <span style="background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">PAID</span>
                            </td>
                        </tr>
                    </table>
                </div>

                ${data.isInternship ? `
                <div style="background: #e8f4fd; border-left: 4px solid #2196f3; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #1565c0; margin: 0 0 10px 0;">What's Next?</h4>
                    <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Our team will contact you within 24-48 hours</li>
                        <li>You'll receive access credentials for the learning portal</li>
                        <li>Onboarding session will be scheduled</li>
                    </ul>
                </div>
                ` : `
                <div style="background: #e8f4fd; border-left: 4px solid #2196f3; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
                    <h4 style="color: #1565c0; margin: 0 0 10px 0;">What's Next?</h4>
                    <p style="color: #555; margin: 0; line-height: 1.6;">
                        You will receive further instructions regarding delivery/access within 24-48 hours.
                    </p>
                </div>
                `}

                <p style="color: #555; line-height: 1.7;">
                    📎 <strong>Your invoice is attached to this email.</strong><br><br>
                    If you have any questions, feel free to reply to this email or contact us at 
                    <a href="mailto:official@zecurx.com" style="color: #2196f3;">official@zecurx.com</a>
                </p>
            </div>

            <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} ZecurX Technologies. All rights reserved.<br>
                    <a href="https://www.zecurx.com" style="color: #2196f3; text-decoration: none;">www.zecurx.com</a>
                </p>
            </div>
        </div>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX <official@zecurx.com>',
            to: data.email,
            subject: emailSubject,
            html: userEmailHtml,
            attachments: [{
                filename: `ZecurX-Invoice-${invoiceNumber}.pdf`,
                content: invoicePdf,
            }],
        });
        console.log(`Invoice email sent to: ${data.email}`);
    } catch (emailError) {
        console.error('Failed to send invoice email:', emailError);
    }

    const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">
                ${data.isInternship ? '🎓 New Internship Enrollment' : '💰 New Purchase'}
            </h2>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Customer:</strong> ${data.name || 'N/A'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.email}</p>
                ${data.phone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
                ${data.college ? `<p style="margin: 0 0 10px 0;"><strong>Institution:</strong> ${data.college}</p>` : ''}
                <p style="margin: 0 0 10px 0;"><strong>Item:</strong> ${data.itemName}</p>
                <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
                <p style="margin: 0 0 10px 0;"><strong>Payment ID:</strong> ${data.paymentId}</p>
                <p style="margin: 0;"><strong>Invoice #:</strong> ${invoiceNumber}</p>
            </div>
            
            <p style="color: #888; font-size: 12px;">
                Invoice has been automatically sent to the customer.
            </p>
        </div>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX Website <official@zecurx.com>',
            to: adminEmail,
            subject: `New ${data.isInternship ? 'Enrollment' : 'Purchase'}: ${data.itemName} - ₹${data.amount}`,
            html: adminEmailHtml,
            attachments: [{
                filename: `ZecurX-Invoice-${invoiceNumber}.pdf`,
                content: invoicePdf,
            }],
        });
        console.log(`Admin notification sent to: ${adminEmail}`);
    } catch (adminError) {
        console.error('Failed to send admin notification:', adminError);
    }
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

            if (notes.email) {
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

                if (customer) {
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
                        `, [paymentId, orderId, amount, 'captured', customer.id, planId]);
                    } catch (txError: unknown) {
                        const errorMessage = txError instanceof Error ? txError.message : 'Unknown error';
                        console.error('Webhook: Transaction DB Error:', errorMessage);
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
                    await sendInvoiceEmail({
                        name: notes.name || '',
                        email: notes.email,
                        itemName: notes.itemName || 'ZecurX Product',
                        amount,
                        paymentId,
                        orderId,
                        phone: notes.mobile || notes.phone,
                        college: notes.college,
                        isInternship,
                    });
                    console.log('Webhook: Invoice email sent successfully');
                } catch (invoiceError) {
                    console.error('Webhook: Invoice email failed:', invoiceError);
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
            
            await query(
                'UPDATE transactions SET status = $1 WHERE payment_id = $2',
                ['refunded', refund.payment_id]
            );
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
        supportedEvents: ['payment.captured', 'payment.failed', 'refund.created'],
        features: ['Invoice PDF generation', 'Email notifications', 'Google Sheets logging']
    });
}
