/**
 * ZecurX Branded Email Template System
 * 
 * Provides consistent, premium email templates for all transactional
 * and marketing emails. All emails use table-based layouts for
 * maximum email client compatibility.
 */
import { CDN_ASSETS } from '@/lib/cdn';

const LOGO_URL = CDN_ASSETS.brand.logo;
const WEBSITE_URL = 'https://www.zecurx.com';
const SUPPORT_EMAIL = 'official@zecurx.com';

// Social links
const SOCIAL = {
    linkedin: 'https://www.linkedin.com/company/zecurx',
    instagram: 'https://www.instagram.com/zecurx',
    twitter: 'https://x.com/zecurx',
};

// Accent colors per email type - UPDATED TO MONOCHROMATIC
const ACCENT_COLORS: Record<string, string> = {
    default: '#0a0a0f',      // Black
    success: '#0a0a0f',      // Black
    warning: '#0a0a0f',      // Black
    error: '#0a0a0f',        // Black
    info: '#0a0a0f',         // Black
    premium: '#0a0a0f',      // Black
    certificate: '#0a0a0f',  // Black
};

type EmailAccent = keyof typeof ACCENT_COLORS;

interface EmailTemplateOptions {
    /** Accent color theme */
    accent?: EmailAccent;
    /** Main email content (HTML string) */
    body: string;
    /** Preview text shown in inbox before opening */
    previewText?: string;
    /** Optional CTA section after main content */
    cta?: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
    };
    /** Whether to include the marketing footer section */
    includeMarketing?: boolean;
    /** Type of marketing footer to display */
    marketingType?: 'student' | 'corporate';
    /** Whether to show social links in footer */
    showSocials?: boolean;
}

/**
 * Wraps email content in a branded ZecurX template.
 * Works across all major email clients (Gmail, Outlook, Apple Mail, Yahoo).
 */
export function brandedEmailTemplate(options: EmailTemplateOptions): string {
    const {
        accent = 'default',
        body,
        previewText = '',
        cta,
        includeMarketing = true,
        marketingType = 'corporate',
        showSocials = true,
    } = options;

    const accentColor = ACCENT_COLORS[accent] || ACCENT_COLORS.default;
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>ZecurX</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        * { margin: 0; padding: 0; }
        body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a { color: ${accentColor}; text-decoration: none; }
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; }
            .fluid { max-width: 100% !important; height: auto !important; }
            .stack-column { display: block !important; width: 100% !important; }
            .center-on-narrow { text-align: center !important; display: block !important; margin: 0 auto !important; }
            .content-padding { padding: 24px 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f0f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
    
    <!-- Outer wrapper -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f0f0;">
        <tr>
            <td align="center" style="padding: 30px 10px;">
                
                <!-- Email container -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- ═══════════ HEADER ═══════════ -->
                    <tr>
                        <td style="background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%); padding: 48px 30px; text-align: center;">
                            <img src="${LOGO_URL}" alt="ZecurX" width="145" height="auto" style="display: block; margin: 0 auto; max-width: 145px;" />
                            <p style="color: #ffffff; margin: 20px 0 0; font-size: 15px; letter-spacing: 4px; text-transform: uppercase; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">ZecurX Private Limited</p>
                        </td>
                    </tr>

                    <!-- Accent bar -->
                    <tr>
                        <td style="background: ${accentColor}; height: 3px; font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- ═══════════ BODY ═══════════ -->
                    <tr>
                        <td class="content-padding" style="padding: 36px 32px 24px;">
                            ${body}
                        </td>
                    </tr>

                    ${cta ? `
                    <!-- ═══════════ CTA SECTION ═══════════ -->
                    <tr>
                        <td style="padding: 0 32px 32px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #000000 0%, #2a2a2a 100%); border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                                <tr>
                                    <td style="padding: 44px 32px; text-align: center;">
                                        <h3 style="color: #ffffff; margin: 0 0 12px; font-size: 21px; font-weight: 700; letter-spacing: -0.5px;">${cta.title}</h3>
                                        <p style="color: #b0b0b0; margin: 0 0 28px; font-size: 15px; line-height: 1.6;">${cta.description}</p>
                                        <a href="${cta.buttonUrl}" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-weight: 800; font-size: 14px; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255,255,255,0.25); text-transform: uppercase;">${cta.buttonText}</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ` : ''}

                    ${includeMarketing ? `
                    <!-- ═══════════ MARKETING FOOTER (${marketingType}) ═══════════ -->
                    <tr>
                        <td style="padding: 0 32px 24px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e8e8ec; margin-top: 24px;">
                                ${marketingType === 'student' ? `
                                <!-- STUDENT MARKETING -->
                                <tr>
                                    <td style="padding: 24px 0 12px; text-align: center;">
                                        <p style="color: #6b6b80; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 16px; font-weight: 700;">Build Your Career in Cybersecurity</p>
                                        <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1a1a1a;">ZecurX Academy</h3>
                                        <p style="color: #555; font-size: 14px; margin: 0 0 16px; line-height: 1.6; max-width: 400px; display: inline-block;">
                                            Master ethical hacking, cloud security, and DevSecOps with industry-recognized certifications.
                                        </p>
                                        <br>
                                        <a href="${WEBSITE_URL}/academy" style="display: inline-block; color: ${accentColor}; border: 1px solid ${accentColor}; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 13px;">Explore Courses</a>
                                    </td>
                                </tr>
                                ` : `
                                <!-- CORPORATE MARKETING -->
                                <tr>
                                    <td style="padding: 24px 0 12px; text-align: center;">
                                        <p style="color: #6b6b80; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 16px; font-weight: 700;">Secure Your Enterprise</p>
                                        <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #1a1a1a;">ZecurX Security Services</h3>
                                        <p style="color: #555; font-size: 14px; margin: 0 0 16px; line-height: 1.6; max-width: 400px; display: inline-block;">
                                            Protect your assets with our advanced Penetration Testing, Cloud Security, and AI Defense solutions.
                                        </p>
                                        <br>
                                        <a href="${WEBSITE_URL}/enquiry" style="display: inline-block; color: ${accentColor}; border: 1px solid ${accentColor}; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 13px;">Get a Quote</a>
                                    </td>
                                </tr>
                                `}
                                <tr>
                                    <td style="padding: 16px 0 0; text-align: center; border-top: 1px dashed #e8e8ec;">
                                        <p style="color: #999; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px; font-weight: 600;">Also Explore</p>
                                        <p style="color: #666; font-size: 12px; margin: 0; line-height: 1.8;">
                                            ${marketingType === 'student' ? `
                                            <a href="${WEBSITE_URL}/services/application-security" style="color: #444; text-decoration: none;">VAPT Services</a> &nbsp;•&nbsp;
                                            <a href="${WEBSITE_URL}/blog" style="color: #444; text-decoration: none;">Security Blog</a> &nbsp;•&nbsp;
                                            <a href="${WEBSITE_URL}/careers" style="color: #444; text-decoration: none;">Careers</a>
                                            ` : `
                                            <a href="${WEBSITE_URL}/academy" style="color: #444; text-decoration: none;">ZecurX Academy</a> &nbsp;•&nbsp;
                                            <a href="${WEBSITE_URL}/blog" style="color: #444; text-decoration: none;">Industry Insights</a> &nbsp;•&nbsp;
                                            <a href="${WEBSITE_URL}/about" style="color: #444; text-decoration: none;">About Us</a>
                                            `}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- ═══════════ FOOTER ═══════════ -->
                    <tr>
                        <td style="background-color: #fafafa; padding: 28px 32px; border-top: 1px solid #e8e8ec;">
                            ${showSocials ? `
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 18px;">
                                        <a href="${SOCIAL.linkedin}" style="display: inline-block; margin: 0 6px; color: #999; text-decoration: none; font-size: 13px; font-weight: 500;">LinkedIn</a>
                                        <span style="color: #ddd;">&nbsp;·&nbsp;</span>
                                        <a href="${SOCIAL.instagram}" style="display: inline-block; margin: 0 6px; color: #999; text-decoration: none; font-size: 13px; font-weight: 500;">Instagram</a>
                                        <span style="color: #ddd;">&nbsp;·&nbsp;</span>
                                        <a href="${SOCIAL.twitter}" style="display: inline-block; margin: 0 6px; color: #999; text-decoration: none; font-size: 13px; font-weight: 500;">X (Twitter)</a>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            <p style="color: #999; font-size: 12px; margin: 0; text-align: center; line-height: 1.6;">
                                &copy; ${year} ZecurX Private Limited. All rights reserved.<br>
                                <a href="${WEBSITE_URL}" style="color: #888; text-decoration: underline;">www.zecurx.com</a>
                                &nbsp;·&nbsp;
                                <a href="mailto:${SUPPORT_EMAIL}" style="color: #888; text-decoration: underline;">${SUPPORT_EMAIL}</a>
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- /Email container -->

            </td>
        </tr>
    </table>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
// Template helper: Section with title
// ═══════════════════════════════════════════════════════════
export function emailSection(title: string, content: string): string {
    return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 22px 24px;">
                    <h3 style="color: #1a1a1a; margin: 0 0 14px; font-size: 15px; font-weight: 600; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">${title}</h3>
                    ${content}
                </td>
            </tr>
        </table>`;
}

// ═══════════════════════════════════════════════════════════
// Template helper: Info row
// ═══════════════════════════════════════════════════════════
export function emailInfoRow(label: string, value: string): string {
    return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 6px 0; color: #888; font-size: 14px; width: 40%;">${label}</td>
                <td style="padding: 6px 0; color: #1a1a1a; font-size: 14px; text-align: right; font-weight: 500;">${value}</td>
            </tr>
        </table>`;
}

// ═══════════════════════════════════════════════════════════
// Template helper: Primary button
// ═══════════════════════════════════════════════════════════
export function emailButton(text: string, url: string, color: string = '#0a0a0f'): string {
    return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 8px 0;">
                    <a href="${url}" style="display: inline-block; background: ${color}; color: #ffffff; text-decoration: none; padding: 13px 30px; border-radius: 6px; font-weight: 600; font-size: 14px; letter-spacing: 0.3px;">${text}</a>
                </td>
            </tr>
        </table>`;
}

// ═══════════════════════════════════════════════════════════
// Template helper: Alert/callout box
// ═══════════════════════════════════════════════════════════
export function emailCallout(content: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): string {
    const colors = {
        info: { bg: '#f8f9fa', border: '#0a0a0f', text: '#1a1a1a' },
        success: { bg: '#f8f9fa', border: '#0a0a0f', text: '#1a1a1a' },
        warning: { bg: '#f8f9fa', border: '#0a0a0f', text: '#1a1a1a' },
        error: { bg: '#f8f9fa', border: '#0a0a0f', text: '#1a1a1a' },
    };
    const c = colors[type];
    return `
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
            <tr>
                <td style="background: ${c.bg}; border-left: 4px solid ${c.border}; padding: 18px 22px; border-radius: 0 8px 8px 0;">
                    <div style="color: ${c.text}; font-size: 14px; line-height: 1.6;">${content}</div>
                </td>
            </tr>
        </table>`;
}
