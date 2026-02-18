import { query } from '@/lib/db';
import { Resend } from 'resend';
import { OtpPurpose, OtpVerification } from '@/types/seminar';
import { brandedEmailTemplate } from '@/lib/email-template';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(
    email: string,
    purpose: OtpPurpose,
    seminarId?: string
): Promise<string> {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await query(
        `DELETE FROM seminar.otp_verifications 
         WHERE email = $1 AND purpose = $2 AND (seminar_id = $3 OR ($3 IS NULL AND seminar_id IS NULL))`,
        [email, purpose, seminarId || null]
    );

    await query(
        `INSERT INTO seminar.otp_verifications 
         (email, otp_code, purpose, seminar_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, otp, purpose, seminarId || null, expiresAt.toISOString()]
    );

    return otp;
}

export async function verifyOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose,
    seminarId?: string
): Promise<{ valid: boolean; error?: string }> {
    // Only check seminar_id if it's provided or if purpose requires it (registration/certificate)
    // For admin_login, seminar_id is null

    // Construct query based on seminarId presence
    const result = await query<OtpVerification>(
        `SELECT * FROM seminar.otp_verifications 
         WHERE email = $1 AND purpose = $2 AND (seminar_id = $3 OR ($3 IS NULL AND seminar_id IS NULL)) AND verified = false
         ORDER BY created_at DESC LIMIT 1`,
        [email, purpose, seminarId || null]
    );

    const record = result.rows[0];

    if (!record) {
        return { valid: false, error: 'No OTP found. Please request a new one.' };
    }

    if (new Date(record.expires_at) < new Date()) {
        return { valid: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (record.otp_code !== otp) {
        await query(
            `UPDATE seminar.otp_verifications SET attempts = attempts + 1 WHERE id = $1`,
            [record.id]
        );
        return { valid: false, error: 'Invalid OTP. Please try again.' };
    }

    await query(
        `UPDATE seminar.otp_verifications SET verified = true WHERE id = $1`,
        [record.id]
    );

    return { valid: true };
}

export async function sendOtpEmail(
    email: string,
    otp: string,
    purpose: OtpPurpose,
    seminarTitle: string
): Promise<boolean> {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const purposeText = purpose === 'registration'
        ? 'complete your registration'
        : purpose === 'admin_login'
            ? 'access the admin dashboard'
            : 'access your certificate';

    const subject = purpose === 'registration'
        ? `Your Registration OTP for ${seminarTitle} - ZecurX`
        : purpose === 'admin_login'
            ? `Admin Login Verification - ZecurX`
            : `Your Certificate Access OTP - ZecurX`;

    const bodyContent = `
        <div style="text-align: center;">
            <h1 style="color: #1a1a1a; margin: 0 0 8px; font-size: 24px; font-weight: 700;">Verification Code</h1>
            <p style="color: #666; margin: 0 0 8px; font-size: 15px; line-height: 1.5;">
                Use this code to ${purposeText} for:
            </p>
            <p style="font-weight: 600; color: #1a1a1a; margin: 0 0 28px; font-size: 16px;">
                ${seminarTitle}
            </p>
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center">
                        <div style="background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 10px; padding: 22px 44px; border-radius: 10px; display: inline-block; font-family: 'Courier New', monospace;">
                            ${otp}
                        </div>
                    </td>
                </tr>
            </table>
            
            <p style="color: #999; font-size: 13px; margin: 24px 0 0;">
                This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. Do not share it with anyone.
            </p>
        </div>
    `;

    const html = brandedEmailTemplate({
        accent: 'info',
        body: bodyContent,
        previewText: `Your ZecurX verification code: ${otp}`,
        includeMarketing: false,
        showSocials: true,
    });

    try {
        await resend.emails.send({
            from: 'ZecurX Private Limited <official@zecurx.com>',
            to: email,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return false;
    }
}

export async function cleanupExpiredOtps(): Promise<number> {
    const result = await query(
        `DELETE FROM seminar.otp_verifications WHERE expires_at < NOW()`
    );
    return result.rowCount || 0;
}
