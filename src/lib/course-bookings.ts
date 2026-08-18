import { query, getClient } from '@/lib/db';
import { sendEmail } from '@/lib/sendgrid';
import { brandedEmailTemplate, emailSection, emailButton, emailCallout } from '@/lib/email-template';
import { logger } from '@/lib/logger';

export const DEPOSIT_AMOUNT = 2000;
export const PAYMENT_DUE_DAYS = 15;

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com';

export type BookingStatus = 'pending_deposit' | 'slot_booked' | 'fully_paid' | 'cancelled';
export type BookingBadge = 'paid' | 'payment_due' | 'fully_paid';
export type PaymentOption = 'deposit' | 'full';
export type DiscountType = 'percentage' | 'fixed';

export interface CourseBooking {
    id: string;
    booking_token: string;
    batch_id: string;
    plan_id: string;
    customer_id: string | null;
    customer_name: string | null;
    customer_email: string;
    customer_phone: string | null;
    payment_option: PaymentOption;
    deposit_amount: string | number;
    total_amount: string | number;
    amount_paid: string | number;
    deposit_order_id: string | null;
    deposit_payment_id: string | null;
    balance_order_id: string | null;
    balance_payment_id: string | null;
    referral_code: string | null;
    partner_referral_code: string | null;
    is_partner_referral: boolean;
    partner_referral_id: string | null;
    discount_type: DiscountType | null;
    discount_value: string | number | null;
    discount_amount: string | number;
    status: BookingStatus;
    deposit_paid_at: string | null;
    payment_due_at: string | null;
    fully_paid_at: string | null;
    course_access_enabled: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Computes the admin-facing payment badge from booking state.
 * "Payment Due" is derived live from payment_due_at rather than stored, so it
 * flips automatically with no scheduled job.
 */
export function computeBookingBadge(booking: Pick<CourseBooking, 'status' | 'payment_due_at'>): BookingBadge | null {
    if (booking.status === 'fully_paid') return 'fully_paid';
    if (booking.status === 'slot_booked') {
        if (booking.payment_due_at && new Date(booking.payment_due_at).getTime() < Date.now()) {
            return 'payment_due';
        }
        return 'paid';
    }
    return null;
}

/** What's still owed on a booking, after the locked-in discount. Never negative. */
export function remainingBalance(booking: Pick<CourseBooking, 'total_amount' | 'amount_paid' | 'discount_amount'>): number {
    const total = parseFloat(String(booking.total_amount));
    const paid = parseFloat(String(booking.amount_paid));
    const discount = parseFloat(String(booking.discount_amount)) || 0;
    return Math.max(0, total - paid - discount);
}

interface DepositNotes {
    batchId?: string;
    planId?: string;
    name?: string;
    email?: string;
    phone?: string;
    paymentOption?: string;
    referralCode?: string;
    partnerReferralCode?: string;
    isPartnerReferral?: string | boolean;
    partnerReferralId?: string;
    discountType?: string;
    discountValue?: string | number;
    discountAmount?: string | number;
}

/**
 * Idempotently records a verified first payment on a booking — either the ₹2,000 deposit
 * (payment_option 'deposit') or the full course fee paid up front (payment_option 'full').
 * Upserts the customer, creates the course_bookings row, increments the batch's seat count,
 * logs a transactions row, and — if a coupon was redeemed — records that redemption against
 * the same referral/partner-referral tables the rest of the site uses, so `max_uses` is
 * consumed exactly like it would be at regular checkout. The discount amount passed in here
 * is trusted as already server-validated (it comes from the Razorpay order's own notes,
 * fetched from Razorpay directly, not from client input) and is locked into the booking row
 * permanently. Called from both the client-facing verify route (fast path) and the Razorpay
 * webhook (durable safety-net path), so it must be safe to invoke twice for the same payment.
 */
export async function confirmDepositPayment(params: {
    orderId: string;
    paymentId: string;
    amount: number;
    notes: DepositNotes;
}): Promise<{ booking: CourseBooking } | { error: string }> {
    const { orderId, paymentId, amount, notes } = params;
    const { batchId, planId, name, email, phone } = notes;
    const paymentOption: PaymentOption = notes.paymentOption === 'full' ? 'full' : 'deposit';
    const discountAmount = parseFloat(String(notes.discountAmount)) || 0;
    const discountType = (notes.discountType as DiscountType) || null;
    const discountValue = notes.discountValue != null ? parseFloat(String(notes.discountValue)) : null;
    const referralCode = notes.referralCode || null;
    const partnerReferralCode = notes.partnerReferralCode || null;
    const isPartnerReferral = notes.isPartnerReferral === true || notes.isPartnerReferral === 'true';
    const partnerReferralId = notes.partnerReferralId || null;

    if (!batchId || !planId || !email) {
        return { error: 'Missing booking metadata on payment' };
    }

    const existing = await query<CourseBooking>(
        'SELECT * FROM zecurx_admin.course_bookings WHERE deposit_payment_id = $1',
        [paymentId]
    );
    if (existing.rows.length > 0) {
        return { booking: existing.rows[0] };
    }

    const client = await getClient();
    try {
        await client.query('BEGIN');

        const batchResult = await client.query(
            'SELECT * FROM zecurx_admin.course_batches WHERE id = $1 FOR UPDATE',
            [batchId]
        );
        if (batchResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return { error: 'Batch not found' };
        }

        const planResult = await client.query('SELECT price FROM plans WHERE id = $1', [planId]);
        if (planResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return { error: 'Course not found' };
        }
        const totalAmount = parseFloat(planResult.rows[0].price);

        const customerResult = await client.query(
            `INSERT INTO customers (email, name, phone)
             VALUES ($1, $2, $3)
             ON CONFLICT (email)
             DO UPDATE SET
                name = COALESCE(EXCLUDED.name, customers.name),
                phone = COALESCE(EXCLUDED.phone, customers.phone),
                updated_at = NOW()
             RETURNING *`,
            [email, name || null, phone || null]
        );
        const customer = customerResult.rows[0];

        const now = new Date();
        const isFull = paymentOption === 'full';
        const bookingDepositAmount = isFull ? 0 : amount;
        const bookingAmountPaid = isFull ? totalAmount - discountAmount : amount;
        const paymentDueAt = isFull ? null : new Date(now.getTime() + PAYMENT_DUE_DAYS * 24 * 60 * 60 * 1000);

        const bookingResult = await client.query<CourseBooking>(
            `INSERT INTO zecurx_admin.course_bookings (
                batch_id, plan_id, customer_id, customer_name, customer_email, customer_phone,
                payment_option, deposit_amount, total_amount, amount_paid,
                deposit_order_id, deposit_payment_id,
                referral_code, partner_referral_code, is_partner_referral, partner_referral_id,
                discount_type, discount_value, discount_amount,
                status, deposit_paid_at, payment_due_at, fully_paid_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING *`,
            [
                batchId, planId, customer.id, name || null, email, phone || null,
                paymentOption, bookingDepositAmount, totalAmount, bookingAmountPaid,
                orderId, paymentId,
                referralCode, partnerReferralCode, isPartnerReferral, partnerReferralId,
                discountType, discountValue, discountAmount,
                isFull ? 'fully_paid' : 'slot_booked',
                now.toISOString(),
                paymentDueAt ? paymentDueAt.toISOString() : null,
                isFull ? now.toISOString() : null,
            ]
        );
        const booking = bookingResult.rows[0];

        await client.query(
            'UPDATE zecurx_admin.course_batches SET seats_booked = seats_booked + 1, updated_at = NOW() WHERE id = $1',
            [batchId]
        );

        await client.query(
            `INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
             VALUES ($1, $2, $3, 'captured', $4, $5)`,
            [paymentId, orderId, amount, customer.id, planId]
        );

        // Consume the coupon exactly as regular checkout would, so max_uses is respected
        // sitewide (not a booking-specific rule) and the discount stays locked to this booking.
        if (discountAmount > 0 && referralCode && !isPartnerReferral) {
            await redeemReferralCode(client, {
                code: referralCode,
                orderId,
                email,
                originalAmount: isFull ? totalAmount : totalAmount - DEPOSIT_AMOUNT,
                discountAmount,
                finalAmount: isFull ? totalAmount - discountAmount : totalAmount - DEPOSIT_AMOUNT - discountAmount,
            });
        } else if (discountAmount > 0 && partnerReferralCode && isPartnerReferral && partnerReferralId) {
            await redeemPartnerReferral(client, {
                partnerReferralId,
                orderId,
                paymentId,
                email,
                name: name || '',
                originalAmount: isFull ? totalAmount : totalAmount - DEPOSIT_AMOUNT,
                discountAmount,
                finalAmount: isFull ? totalAmount - discountAmount : totalAmount - DEPOSIT_AMOUNT - discountAmount,
            });
        }

        await client.query('COMMIT');

        return { booking };
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error({ err, paymentId, orderId }, 'Failed to confirm course booking payment');
        return { error: 'Failed to record booking' };
    } finally {
        client.release();
    }
}

async function redeemReferralCode(
    client: { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> },
    params: { code: string; orderId: string; email: string; originalAmount: number; discountAmount: number; finalAmount: number }
): Promise<void> {
    const codeResult = await client.query(
        `SELECT id FROM public.referral_codes WHERE code = $1`,
        [params.code.toUpperCase().trim()]
    );
    if (codeResult.rows.length === 0) return;

    const referralCodeId = codeResult.rows[0].id;

    await client.query(
        `INSERT INTO public.referral_code_usages (
            referral_code_id, order_id, customer_email, original_amount, discount_applied, final_amount
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [referralCodeId, params.orderId, params.email, params.originalAmount, params.discountAmount, params.finalAmount]
    );

    await client.query(
        `UPDATE public.referral_codes SET current_uses = current_uses + 1, updated_at = NOW() WHERE id = $1`,
        [referralCodeId]
    );
}

async function redeemPartnerReferral(
    client: { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> },
    params: { partnerReferralId: string; orderId: string; paymentId: string; email: string; name: string; originalAmount: number; discountAmount: number; finalAmount: number }
): Promise<void> {
    const partnerResult = await client.query(
        `SELECT id, commission_type, commission_value FROM public.partner_referrals WHERE id = $1`,
        [params.partnerReferralId]
    );
    if (partnerResult.rows.length === 0) return;

    const partner = partnerResult.rows[0] as { id: string; commission_type: string; commission_value: number };
    const commissionEarned = partner.commission_type === 'percentage'
        ? (params.originalAmount * Number(partner.commission_value)) / 100
        : Number(partner.commission_value);

    await client.query(
        `INSERT INTO public.partner_referral_usages (
            partner_referral_id, order_id, payment_id, customer_email, customer_name,
            original_amount, discount_applied, final_amount, commission_earned
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
            partner.id, params.orderId, params.paymentId, params.email, params.name,
            params.originalAmount, params.discountAmount, params.finalAmount, commissionEarned,
        ]
    );

    await client.query(
        `UPDATE public.partner_referrals
         SET current_uses = current_uses + 1, total_earnings = total_earnings + $1
         WHERE id = $2`,
        [commissionEarned, partner.id]
    );
}

interface BalanceNotes {
    bookingId?: string;
    token?: string;
}

/**
 * Idempotently records a verified balance payment against an existing booking,
 * marking it fully_paid once amount_paid reaches total_amount minus the locked-in discount.
 */
export async function confirmBalancePayment(params: {
    orderId: string;
    paymentId: string;
    amount: number;
    notes: BalanceNotes;
}): Promise<{ booking: CourseBooking } | { error: string }> {
    const { orderId, paymentId, amount, notes } = params;
    const bookingId = notes.bookingId;

    if (!bookingId) {
        return { error: 'Missing booking id on payment' };
    }

    const existing = await query<CourseBooking>(
        'SELECT * FROM zecurx_admin.course_bookings WHERE balance_payment_id = $1',
        [paymentId]
    );
    if (existing.rows.length > 0) {
        return { booking: existing.rows[0] };
    }

    const client = await getClient();
    try {
        await client.query('BEGIN');

        const bookingResult = await client.query<CourseBooking>(
            'SELECT * FROM zecurx_admin.course_bookings WHERE id = $1 FOR UPDATE',
            [bookingId]
        );
        if (bookingResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return { error: 'Booking not found' };
        }
        const booking = bookingResult.rows[0];

        const newAmountPaid = parseFloat(String(booking.amount_paid)) + amount;
        const discount = parseFloat(String(booking.discount_amount)) || 0;
        const isFullyPaid = newAmountPaid >= parseFloat(String(booking.total_amount)) - discount - 0.01;
        const fullyPaidAt = isFullyPaid ? new Date().toISOString() : null;

        const updated = await client.query<CourseBooking>(
            `UPDATE zecurx_admin.course_bookings
             SET amount_paid = $1,
                 balance_order_id = $2,
                 balance_payment_id = $3,
                 status = CASE WHEN $4 THEN 'fully_paid' ELSE status END,
                 fully_paid_at = COALESCE($5, fully_paid_at),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [newAmountPaid, orderId, paymentId, isFullyPaid, fullyPaidAt, bookingId]
        );

        await client.query(
            `INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
             VALUES ($1, $2, $3, 'captured', $4, $5)`,
            [paymentId, orderId, amount, booking.customer_id, booking.plan_id]
        );

        await client.query('COMMIT');

        return { booking: updated.rows[0] };
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error({ err, paymentId, orderId }, 'Failed to confirm course booking balance payment');
        return { error: 'Failed to record payment' };
    } finally {
        client.release();
    }
}

export async function sendBookingConfirmationEmail(params: {
    email: string;
    name: string;
    courseName: string;
    batchName: string;
    depositAmount: number;
    totalAmount: number;
    discountAmount: number;
    couponCode: string | null;
    bookingToken: string;
}): Promise<void> {
    const { email, name, courseName, batchName, depositAmount, totalAmount, discountAmount, couponCode, bookingToken } = params;
    const remaining = Math.max(0, totalAmount - depositAmount - discountAmount);
    const bookingUrl = `${SITE_URL}/academy/booking/${bookingToken}`;

    const body = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">✅ Slot Booked!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
            Hi <strong>${name || 'there'}</strong>,<br><br>
            Your slot for <strong>${courseName}</strong> (${batchName}) has been reserved with your ₹${depositAmount.toLocaleString('en-IN')} deposit.
        </p>
        ${couponCode ? emailCallout(`Coupon <strong>${couponCode}</strong> applied — you save ₹${discountAmount.toLocaleString('en-IN')} on your remaining balance.`) : ''}
        ${emailSection('Booking Summary', `
            <table width="100%" style="border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Course:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${courseName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Batch:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${batchName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Deposit Paid:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 600;">₹${depositAmount.toLocaleString('en-IN')}</td></tr>
                ${discountAmount > 0 ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Coupon Discount:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">-₹${discountAmount.toLocaleString('en-IN')}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; color: #666;"><strong>Remaining Balance:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 600;">₹${remaining.toLocaleString('en-IN')}</td></tr>
            </table>
        `)}
        <p style="color: #555; line-height: 1.7; margin: 20px 0;">
            To keep your seat, please pay the remaining balance within <strong>${PAYMENT_DUE_DAYS} days</strong> using the link below.
        </p>
        ${emailButton('Pay Remaining Balance', bookingUrl)}
        <p style="color: #666; font-size: 13px; margin: 20px 0 0 0;">
            You can also bookmark this link to check your booking status anytime:<br>
            <a href="${bookingUrl}" style="color: #0a0a0f;">${bookingUrl}</a>
        </p>
    `;

    const html = brandedEmailTemplate({
        accent: 'success',
        body,
        previewText: `Your slot for ${courseName} is booked`,
        includeMarketing: false,
        showSocials: true,
    });

    try {
        await sendEmail({ to: email, subject: `Slot Booked: ${courseName} - ZecurX`, html });
    } catch (err) {
        logger.error({ err, email }, 'Failed to send booking confirmation email');
    }
}

export async function sendFullPaymentEmail(params: {
    email: string;
    name: string;
    courseName: string;
    amountPaid?: number;
    discountAmount?: number;
    couponCode?: string | null;
}): Promise<void> {
    const { email, name, courseName, amountPaid, discountAmount = 0, couponCode } = params;

    const body = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">🎉 Payment Complete!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
            Hi <strong>${name || 'there'}</strong>,<br><br>
            You've paid the full course fee for <strong>${courseName}</strong>${amountPaid ? ` (₹${amountPaid.toLocaleString('en-IN')})` : ''}. Our team will enable your access to the course material shortly and reach out with onboarding details.
        </p>
        ${couponCode && discountAmount > 0 ? emailCallout(`Coupon <strong>${couponCode}</strong> applied — you saved ₹${discountAmount.toLocaleString('en-IN')}.`) : ''}
    `;

    const html = brandedEmailTemplate({
        accent: 'success',
        body,
        previewText: `Payment complete for ${courseName}`,
        includeMarketing: false,
        showSocials: true,
    });

    try {
        await sendEmail({ to: email, subject: `Payment Complete: ${courseName} - ZecurX`, html });
    } catch (err) {
        logger.error({ err, email }, 'Failed to send full payment confirmation email');
    }
}
