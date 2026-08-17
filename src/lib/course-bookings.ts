import { query, getClient } from '@/lib/db';
import { sendEmail } from '@/lib/sendgrid';
import { brandedEmailTemplate, emailSection, emailButton } from '@/lib/email-template';
import { logger } from '@/lib/logger';

export const DEPOSIT_AMOUNT = 2000;
export const PAYMENT_DUE_DAYS = 15;

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zecurx.com';

export type BookingStatus = 'pending_deposit' | 'slot_booked' | 'fully_paid' | 'cancelled';
export type BookingBadge = 'paid' | 'payment_due' | 'fully_paid';

export interface CourseBooking {
    id: string;
    booking_token: string;
    batch_id: string;
    plan_id: string;
    customer_id: string | null;
    customer_name: string | null;
    customer_email: string;
    customer_phone: string | null;
    deposit_amount: string | number;
    total_amount: string | number;
    amount_paid: string | number;
    deposit_order_id: string | null;
    deposit_payment_id: string | null;
    balance_order_id: string | null;
    balance_payment_id: string | null;
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

interface DepositNotes {
    batchId?: string;
    planId?: string;
    name?: string;
    email?: string;
    phone?: string;
}

/**
 * Idempotently records a verified ₹2,000 deposit payment: upserts the customer,
 * creates the course_bookings row, increments the batch's seat count, and logs a
 * transactions row for sales reporting. Called from both the client-facing verify
 * route (fast path) and the Razorpay webhook (durable safety-net path), so it must
 * be safe to invoke twice for the same payment.
 */
export async function confirmDepositPayment(params: {
    orderId: string;
    paymentId: string;
    amount: number;
    notes: DepositNotes;
}): Promise<{ booking: CourseBooking } | { error: string }> {
    const { orderId, paymentId, amount, notes } = params;
    const { batchId, planId, name, email, phone } = notes;

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

        const depositPaidAt = new Date();
        const paymentDueAt = new Date(depositPaidAt.getTime() + PAYMENT_DUE_DAYS * 24 * 60 * 60 * 1000);

        const bookingResult = await client.query<CourseBooking>(
            `INSERT INTO zecurx_admin.course_bookings (
                batch_id, plan_id, customer_id, customer_name, customer_email, customer_phone,
                deposit_amount, total_amount, amount_paid,
                deposit_order_id, deposit_payment_id,
                status, deposit_paid_at, payment_due_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'slot_booked', $12, $13)
            RETURNING *`,
            [
                batchId, planId, customer.id, name || null, email, phone || null,
                amount, totalAmount, amount,
                orderId, paymentId,
                depositPaidAt.toISOString(), paymentDueAt.toISOString(),
            ]
        );

        await client.query(
            'UPDATE zecurx_admin.course_batches SET seats_booked = seats_booked + 1, updated_at = NOW() WHERE id = $1',
            [batchId]
        );

        await client.query(
            `INSERT INTO transactions (payment_id, order_id, amount, status, customer_id, plan_id)
             VALUES ($1, $2, $3, 'captured', $4, $5)`,
            [paymentId, orderId, amount, customer.id, planId]
        );

        await client.query('COMMIT');

        return { booking: bookingResult.rows[0] };
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error({ err, paymentId, orderId }, 'Failed to confirm course booking deposit');
        return { error: 'Failed to record booking' };
    } finally {
        client.release();
    }
}

interface BalanceNotes {
    bookingId?: string;
    token?: string;
}

/**
 * Idempotently records a verified balance payment against an existing booking,
 * marking it fully_paid once amount_paid reaches total_amount.
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
        const isFullyPaid = newAmountPaid >= parseFloat(String(booking.total_amount)) - 0.01;
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
    bookingToken: string;
}): Promise<void> {
    const { email, name, courseName, batchName, depositAmount, totalAmount, bookingToken } = params;
    const remaining = totalAmount - depositAmount;
    const bookingUrl = `${SITE_URL}/academy/booking/${bookingToken}`;

    const body = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">✅ Slot Booked!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
            Hi <strong>${name || 'there'}</strong>,<br><br>
            Your slot for <strong>${courseName}</strong> (${batchName}) has been reserved with your ₹${depositAmount.toLocaleString('en-IN')} deposit.
        </p>
        ${emailSection('Booking Summary', `
            <table width="100%" style="border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666;"><strong>Course:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${courseName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Batch:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right;">${batchName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;"><strong>Deposit Paid:</strong></td><td style="padding: 8px 0; color: #1a1a1a; text-align: right; font-weight: 600;">₹${depositAmount.toLocaleString('en-IN')}</td></tr>
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
}): Promise<void> {
    const { email, name, courseName } = params;

    const body = `
        <h2 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 22px;">🎉 Payment Complete!</h2>
        <p style="color: #555; line-height: 1.7; margin: 0 0 20px 0;">
            Hi <strong>${name || 'there'}</strong>,<br><br>
            You've paid the full course fee for <strong>${courseName}</strong>. Our team will enable your access to the course material shortly and reach out with onboarding details.
        </p>
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
