import { query } from '@/lib/db';
import { Resend } from 'resend';
import { OtpPurpose, OtpVerification } from '@/types/seminar';

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(
    email: string,
    purpose: OtpPurpose,
    seminarId: string
): Promise<string> {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await query(
        `DELETE FROM seminar.otp_verifications 
         WHERE email = $1 AND purpose = $2 AND seminar_id = $3`,
        [email, purpose, seminarId]
    );

    await query(
        `INSERT INTO seminar.otp_verifications 
         (email, otp_code, purpose, seminar_id, expires_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, otp, purpose, seminarId, expiresAt.toISOString()]
    );

    return otp;
}

export async function verifyOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose,
    seminarId: string
): Promise<{ valid: boolean; error?: string }> {
    const result = await query<OtpVerification>(
        `SELECT * FROM seminar.otp_verifications 
         WHERE email = $1 AND purpose = $2 AND seminar_id = $3 AND verified = false
         ORDER BY created_at DESC LIMIT 1`,
        [email, purpose, seminarId]
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
        : 'access your certificate';

    const subject = purpose === 'registration'
        ? `Your Registration OTP for ${seminarTitle} - ZecurX`
        : `Your Certificate Access OTP - ZecurX`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; margin: 0;">ZecurX</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Cybersecurity Excellence</p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; text-align: center;">
                <h2 style="color: #1a1a1a; margin: 0 0 10px 0;">Your Verification Code</h2>
                <p style="color: #666; margin: 0 0 25px 0;">
                    Use this code to ${purposeText} for:
                </p>
                <p style="font-weight: bold; color: #1a1a1a; margin: 0 0 25px 0;">
                    ${seminarTitle}
                </p>
                
                <div style="background: #1a1a1a; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block;">
                    ${otp}
                </div>
                
                <p style="color: #999; font-size: 14px; margin: 25px 0 0 0;">
                    This code expires in ${OTP_EXPIRY_MINUTES} minutes.
                </p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                    If you didn't request this code, please ignore this email.<br>
                    This is an automated message from ZecurX.
                </p>
            </div>
        </div>
    `;

    try {
        await resend.emails.send({
            from: 'ZecurX <official@zecurx.com>',
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
