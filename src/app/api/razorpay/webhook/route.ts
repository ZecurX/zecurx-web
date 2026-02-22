import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { appendToSheet } from '@/lib/google-sheets';
import { query } from '@/lib/db';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice';
import { sendEmail, toSendGridAttachment } from '@/lib/sendgrid';
import { processLmsEnrollment } from '@/lib/lms-integration';
import { incrementReferralCodeUsage } from '@/lib/discount-validation';
import { brandedEmailTemplate, emailSection } from '@/lib/email-template';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

async function isLmsResetLinkEnabled(): Promise<boolean> {
    try {
        const result = await query<{ value: boolean | string }>(
            'SELECT value FROM zecurx_admin.settings WHERE key = $1',
            ['lms_reset_link_enabled']
        );
        if (result.rows.length === 0) return true;
        const val = result.rows[0].value;
        return val === true || val === 'true';
    } catch {
        return true;
    }
}

function verifyWebhookSignature(body: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
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
    lmsResetUrl?: string;
    isNewLmsUser?: boolean;
}): Promise<void> {

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

    const userBodyContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">
            ${data.isInternship ? '🎓 Welcome to the Program!' : '✅ Order Confirmed!'}
        </h2>
        
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
            Hi <strong>${data.name || 'there'}</strong>,<br><br>
            ${data.isInternship 
                ? `Congratulations on enrolling in <strong>${data.itemName}</strong>! Your journey into cybersecurity excellence begins now.`
                : `Thank you for your purchase of <strong>${data.itemName}</strong>. Your order has been confirmed.`
            }
        </p>

        ${emailSection('Order Summary', `
            <table width="100%" style="border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Item:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${data.itemName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Amount Paid:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 600; font-size: 18px;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Payment ID:</strong></td><td style="padding: 8px 0; color: #666; text-align: right; font-family: monospace; font-size: 12px;">${data.paymentId}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td><td style="padding: 8px 0; text-align: right;"><span style="background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">PAID</span></td></tr>
            </table>
        `)}

        <p style="color: #666; font-size: 14px; margin: 20px 0;">
            <strong>What's Next:</strong>
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 1.8;">
            ${data.isInternship 
                ? data.lmsResetUrl 
                    ? `<li><strong>Set up your LMS account:</strong> <a href="${data.lmsResetUrl}" style="color: #0a0a0f; text-decoration: underline;">Click here to set your password</a> (valid for 24 hours)</li><li>Our team will contact you within 24-48 hours</li><li>Onboarding session will be scheduled</li>`
                    : `<li>Our team will contact you within 24-48 hours</li><li>Onboarding session will be scheduled</li>`
                : data.lmsResetUrl
                    ? `<li><strong>Access your course:</strong> <a href="${data.lmsResetUrl}" style="color: #0a0a0f; text-decoration: underline;">Click here to set your password</a> and log in to the learning portal. (Link valid for 24 hours)</li>`
                    : `<li>You will receive further instructions regarding delivery/access within 24-48 hours.</li>`
            }
        </ul>

        <p style="color: #555; line-height: 1.7; margin: 20px 0 0 0;">
            📎 <strong>Your invoice is attached to this email.</strong><br><br>
            If you have any questions, feel free to reply to this email or contact us at 
            <a href="mailto:official@zecurx.com" style="color: #0a0a0f; text-decoration: underline;">official@zecurx.com</a>
        </p>
    `;

    const userEmailHtml = brandedEmailTemplate({
        accent: data.isInternship ? 'success' : 'info',
        body: userBodyContent,
        previewText: emailSubject,
        includeMarketing: true,
        marketingType: 'corporate',
        showSocials: true,
    });

    try {
        await sendEmail({
            to: data.email,
            subject: emailSubject,
            html: userEmailHtml,
            attachments: [toSendGridAttachment(invoicePdf, `ZecurX-Invoice-${invoiceNumber}.pdf`)],
        });
    } catch {
    }

    const adminBodyContent = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 20px;">
            ${data.isInternship ? '🎓 New Internship Enrollment' : '💰 New Purchase'}
        </h2>

        ${emailSection('Customer & Order Details', `
            <table width="100%" style="border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #666;"><strong>Customer:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.name || 'N/A'}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.email}</td></tr>
                ${data.phone ? `<tr><td style="padding: 6px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.phone}</td></tr>` : ''}
                ${data.college ? `<tr><td style="padding: 6px 0; color: #666;"><strong>Institution:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.college}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; color: #666;"><strong>Item:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.itemName}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Amount:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">₹${data.amount.toLocaleString('en-IN')}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Payment ID:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${data.paymentId}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;"><strong>Invoice #:</strong></td><td style="padding: 6px 0; color: #1a1a1a; text-align: right;">${invoiceNumber}</td></tr>
            </table>
        `)}

        <p style="color: #666; font-size: 13px; margin: 20px 0 0 0;">
            Invoice has been automatically sent to the customer.
        </p>
    `;

    const adminEmailHtml = brandedEmailTemplate({
        accent: 'info',
        body: adminBodyContent,
        previewText: `New ${data.isInternship ? 'Enrollment' : 'Purchase'}: ${data.itemName}`,
        includeMarketing: false,
        showSocials: false,
    });

    try {
        await sendEmail({
            to: adminEmail,
            subject: `New ${data.isInternship ? 'Enrollment' : 'Purchase'}: ${data.itemName} - ₹${data.amount}`,
            html: adminEmailHtml,
            attachments: [toSendGridAttachment(invoicePdf, `ZecurX-Invoice-${invoiceNumber}.pdf`)],
        });
    } catch {
    }
}

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
        }

        if (!verifyWebhookSignature(rawBody, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const eventType = event.event;

        if (eventType === 'payment.captured') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;
            const amount = payment.amount / 100;
            const notes = payment.notes || {};

            // OPTIMIZATION: Single query to get plan details (eliminates N+1 pattern)
            let planData: { id: string; price: number; name: string } | null = null;
            if (notes.itemName) {
                const planResult = await query<{ id: string; price: number; name: string }>(
                    'SELECT id, price, name FROM plans WHERE name = $1 LIMIT 1',
                    [notes.itemName]
                );
                
                if (planResult.rows.length > 0) {
                    planData = planResult.rows[0];
                    const expectedPrice = parseFloat(String(planData.price));
                    
                    // SECURITY: Verify payment amount matches database price
                    if (Math.abs(expectedPrice - amount) > 0.01) {
                        return NextResponse.json({ 
                            received: true, 
                            warning: 'Amount mismatch - invoice not sent',
                            event: eventType 
                        });
                    }
                }
            }

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
                    // Use planId from notes or from our cached planData (no second query!)
                    const planId = notes.planId || planData?.id || null;

                    try {
                        await query(`
                            INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
                            VALUES ($1, $2, $3, $4, $5, $6)
                        `, [paymentId, orderId, amount, 'captured', customer.id, planId]);
                        
                        if (notes.referralCode || notes.partnerReferralCode) {
                            const incremented = await incrementReferralCodeUsage(
                                notes.referralCode,
                                notes.partnerReferralCode
                            );
                            if (incremented) {
                            }
                        }
                        
                        if (notes.isPromoPrice === 'true' && (notes.promoPrice || notes.promoCode)) {
                            try {
                                if (notes.promoCode) {
                                    await query(`
                                        UPDATE zecurx_admin.promo_prices 
                                        SET current_uses = current_uses + 1, updated_at = NOW()
                                        WHERE promo_code = $1 AND is_active = true
                                    `, [notes.promoCode.toUpperCase()]);
                                } else {
                                    await query(`
                                        UPDATE zecurx_admin.promo_prices 
                                        SET current_uses = current_uses + 1, updated_at = NOW()
                                        WHERE is_active = true
                                        AND $1 >= min_price AND $1 <= max_price
                                        AND (plan_id = $2 OR ($3 ILIKE plan_name_pattern AND plan_name_pattern IS NOT NULL))
                                    `, [parseFloat(notes.promoPrice), notes.itemId, notes.itemName]);
                                }
                            } catch {
                            }
                        }
                    } catch {
                        return NextResponse.json(
                            { error: 'Database transaction failed' },
                            { status: 500 }
                        );
                    }
                }

                const isInternship = notes.itemName?.toLowerCase().includes('internship');

                let lmsResult: { success: boolean; resetUrl?: string; isNewUser?: boolean } = { success: true };
                
                try {
                    lmsResult = await processLmsEnrollment({
                        email: notes.email,
                        name: notes.name || '',
                        phone: notes.mobile || notes.phone,
                        planName: notes.itemName || '',
                        paymentId,
                        amount,
                    });
                    
                    if (lmsResult.success && lmsResult.isNewUser) {
                    } else if (lmsResult.success) {
                    }
                } catch {
                }

                // OPTIMIZATION: Run Google Sheets and email in parallel, non-blocking
                const lmsResetLinkEnabled = await isLmsResetLinkEnabled();
                
                const backgroundTasks: Promise<{ type: string; success: boolean; error?: unknown }>[] = [];
                
                // Google Sheets sync (internships only)
                if (isInternship) {
                    backgroundTasks.push(
                        appendToSheet({
                            name: notes.name || '',
                            email: notes.email,
                            mobile: notes.mobile || notes.phone || '',
                            college: notes.college || '',
                            course: notes.itemName || 'Unknown',
                            price: amount,
                            paymentId: paymentId,
                            date: new Date().toISOString()
                        })
                        .then(() => ({ type: 'sheets', success: true }))
                        .catch((error) => ({ type: 'sheets', success: false, error }))
                    );
                }
                
                // Invoice email
                backgroundTasks.push(
                    sendInvoiceEmail({
                        name: notes.name || '',
                        email: notes.email,
                        itemName: notes.itemName || 'ZecurX Product',
                        amount,
                        paymentId,
                        orderId,
                        phone: notes.mobile || notes.phone,
                        college: notes.college,
                        isInternship,
                        lmsResetUrl: lmsResetLinkEnabled ? lmsResult.resetUrl : undefined,
                        isNewLmsUser: lmsResetLinkEnabled ? lmsResult.isNewUser : undefined,
                    })
                    .then(() => ({ type: 'email', success: true }))
                    .catch((error) => ({ type: 'email', success: false, error }))
                );
                
                // Run all background tasks in parallel (non-blocking - don't fail webhook)
                await Promise.allSettled(backgroundTasks);
            }
        }

        if (eventType === 'payment.failed') {
        }

        if (eventType === 'refund.created') {
            const refund = event.payload.refund.entity;
            
            await query(
                'UPDATE transactions SET status = $1 WHERE payment_id = $2',
                ['refunded', refund.payment_id]
            );
        }

        return NextResponse.json({ received: true, event: eventType });

    } catch {
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// GET method removed for security - prevents info disclosure about webhook capabilities
