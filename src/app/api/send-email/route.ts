import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { appendToSheet } from '@/lib/google-sheets';
import { fetchFromCdn } from '@/lib/cdn';

export async function POST(request: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const body = await request.json();
        const { name, email, subject, message, formType, preferredDate } = body;

        // Validate required fields
        if (!name || !email || (!message && formType !== 'brochure' && formType !== 'purchase')) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email content based on form type
        const isDemo = formType === 'demo';
        const isContact = formType === 'contact';
        const isBrochure = formType === 'brochure';
        const isPurchase = formType === 'purchase';
        const isInternship = isPurchase && body.itemName?.toLowerCase().includes('internship');

        const emailSubject = isDemo
            ? `New Demo Request from ${name}`
            : isBrochure
                ? `Brochure Download: ${body.courseTitle} by ${name}`
                : isInternship
                    ? `New Internship Enrollment: ${body.itemName} by ${name}`
                    : isPurchase
                        ? `New Purchase: ${body.itemName} by ${name}`
                        : `New Contact: ${subject || 'General Inquiry'}`;

        // Save to Google Sheets if it's a purchase/internship
        if (isPurchase || isInternship) {
            try {
                let courseName = body.itemName || 'Unknown Item';
                if (isInternship && body.courseTitle) courseName = body.courseTitle;

                await appendToSheet({
                    name,
                    email,
                    mobile: body.mobile || '',
                    college: body.college || '',
                    course: courseName,
                    price: body.price || 0,
                    paymentId: body.paymentId || '',
                    date: new Date().toISOString()
                });
            } catch (sheetError) {
                console.error('Failed to save to Google Sheets:', sheetError);
            }
        }

        // Calendar Links Generator
        const getGoogleCalendarUrl = (dateStr: string) => {
            const date = new Date(dateStr);
            const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
            const title = encodeURIComponent(isDemo ? "ZecurX Demo" : "ZecurX Meeting");
            const details = encodeURIComponent(isDemo ? "Demo of ZecurX Security Platform." : "Meeting with ZecurX Team.");
            return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
        };

        const getOutlookCalendarUrl = (dateStr: string) => {
            const date = new Date(dateStr);
            const start = date.toISOString();
            const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString();
            const title = encodeURIComponent(isDemo ? "ZecurX Demo" : "ZecurX Meeting");
            const details = encodeURIComponent(isDemo ? "Demo of ZecurX Security Platform." : "Meeting with ZecurX Team.");
            return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${start}&enddt=${end}`;
        };

        // Calendar HTML for both demo and contact with preferredDate
        const calendarHtml = preferredDate ? `
            <div style="margin-top: 25px; text-align: center;">
                <p style="margin-bottom: 15px; color: #555;"><strong>Add to your calendar:</strong></p>
                <a href="${getGoogleCalendarUrl(preferredDate)}" style="background: #fff; color: #333; border: 1px solid #ccc; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-right: 10px; font-size: 14px; font-weight: bold;">Google Calendar</a>
                <a href="${getOutlookCalendarUrl(preferredDate)}" style="background: #0078D4; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">Outlook</a>
            </div>
        ` : '';

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">
                    ${isDemo ? '🎯 New Demo Request' : isBrochure ? '📄 Brochure Download Request' : isInternship ? '🎓 New Internship Enrollment' : isPurchase ? '💰 New Purchase' : '📧 New Contact Message'}
                </h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                    ${body.mobile ? `<p style="margin: 0 0 10px 0;"><strong>Mobile:</strong> ${body.mobile}</p>` : ''}
                    ${body.college ? `<p style="margin: 0 0 10px 0;"><strong>College:</strong> ${body.college}</p>` : ''}
                    
                    ${isBrochure && body.courseTitle ? `<p style="margin: 0 0 10px 0;"><strong>Course:</strong> ${body.courseTitle}</p>` : ''}
                    ${isPurchase && body.itemName ? `<p style="margin: 0 0 10px 0;"><strong>Item:</strong> ${body.itemName}</p>` : ''}
                    
                    ${isPurchase && body.discountAmount > 0 ? `<p style="margin: 0 0 10px 0;"><strong>Original Price:</strong> ₹${body.originalPrice}</p>` : ''}
                    ${isPurchase && body.discountAmount > 0 ? `<p style="margin: 0 0 10px 0; color: green;"><strong>Discount:</strong> -₹${body.discountAmount}</p>` : ''}
                    
                    ${isPurchase && body.price ? `<p style="margin: 0 0 10px 0;"><strong>${body.discountAmount > 0 ? 'Total Paid' : 'Price'}:</strong> ₹${body.price}</p>` : ''}
                    ${isPurchase && body.paymentId ? `<p style="margin: 0 0 10px 0;"><strong>Payment ID:</strong> ${body.paymentId}</p>` : ''}
                    
                    ${body.company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${body.company}</p>` : ''}
                    ${body.role ? `<p style="margin: 0 0 10px 0;"><strong>Role:</strong> ${body.role}</p>` : ''}
                    ${preferredDate ? `<p style="margin: 0 0 10px 0;"><strong>Preferred Date:</strong> ${new Date(preferredDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>` : ''}
                    ${body.service ? `<p style="margin: 0 0 10px 0;"><strong>Service Interest:</strong> ${body.service}</p>` : ''}
                    ${subject ? `<p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
                </div>

                ${!isBrochure && !isPurchase ? `
                <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #333;">Message:</h3>
                    <p style="color: #555; line-height: 1.6;">${message ? message.replace(/\n/g, '<br>') : 'No message provided'}</p>
                </div>` : ''}

                <p style="color: #888; font-size: 12px; margin-top: 20px;">
                    This email was sent from the ZecurX website.
                </p>
            </div>
        `;

        const serviceToPdf: { [key: string]: { filename: string; cdnPath: string } } = {
            'penetration testing': { filename: 'ZecurX_Penetration_Testing.pdf', cdnPath: 'brochures/services/compressed/penetration-testing.pdf' },
            'vulnerability management': { filename: 'ZecurX_Red_Teaming.pdf', cdnPath: 'brochures/services/compressed/red-teaming.pdf' },
            'red teaming': { filename: 'ZecurX_Red_Teaming.pdf', cdnPath: 'brochures/services/compressed/red-teaming.pdf' },
            'web & app security': { filename: 'ZecurX_Security_Ops.pdf', cdnPath: 'brochures/services/compressed/security-ops.pdf' },
            'devsecops implementation': { filename: 'ZecurX_Security_Ops.pdf', cdnPath: 'brochures/services/compressed/security-ops.pdf' },
            'secure development': { filename: 'ZecurX_Security_Ops.pdf', cdnPath: 'brochures/services/compressed/security-ops.pdf' },
            'strategic consulting': { filename: 'ZecurX_Risk_Audit.pdf', cdnPath: 'brochures/services/compressed/risk-audit.pdf' },
            'risk audit': { filename: 'ZecurX_Risk_Audit.pdf', cdnPath: 'brochures/services/compressed/risk-audit.pdf' },
            'security operations': { filename: 'ZecurX_Security_Ops.pdf', cdnPath: 'brochures/services/compressed/security-ops.pdf' },
        };

        const selectedService = body.service?.toLowerCase() || 'general';
        const selectedPdf = serviceToPdf[selectedService] || serviceToPdf['penetration testing'];

        let attachments: { filename: string; content: Buffer }[] = [];
        if (isDemo && selectedPdf) {
            const fileContent = await fetchFromCdn(selectedPdf.cdnPath);
            if (fileContent) {
                attachments = [{ filename: selectedPdf.filename, content: fileContent }];
                console.log(`Selected PDF for service "${body.service}": ${selectedPdf.filename}`);
            } else {
                console.warn(`Failed to fetch brochure from CDN: ${selectedPdf.cdnPath}`);
            }
        }

        if (isBrochure && body.brochureLink) {
            let cdnPath = body.brochureLink;
            if (cdnPath.startsWith('http')) {
                cdnPath = cdnPath.replace(/^https?:\/\/[^/]+\//, '');
            } else if (cdnPath.startsWith('/')) {
                cdnPath = cdnPath.slice(1);
            }
            
            const fileContent = await fetchFromCdn(cdnPath);
            if (fileContent) {
                const filename = `ZecurX_${body.courseTitle?.replace(/\s+/g, '_') || 'Course'}_Brochure.pdf`;
                attachments = [{ filename, content: fileContent }];
                console.log(`Attaching course brochure: ${filename}`);
            } else {
                console.warn(`Course brochure not found at CDN: ${cdnPath}`);
            }
        }

        // Admin email recipient
        const adminEmail = isInternship
            ? 'zecurxintern@gmail.com'
            : 'official@zecurx.com';

        // Send admin notification email
        let adminEmailSent = false;
        try {
            await resend.emails.send({
                from: 'ZecurX Website <official@zecurx.com>',
                to: adminEmail,
                replyTo: email,
                subject: emailSubject,
                html: htmlContent,
            });
            adminEmailSent = true;
            console.log(`Admin email sent successfully to: ${adminEmail}`);
        } catch (adminError) {
            console.error('Failed to send admin email:', adminError);
        }

        // Prepare user confirmation email
        let userSubject = 'We received your message - ZecurX';
        if (isDemo) userSubject = 'Demo Request Received - ZecurX';
        else if (isBrochure) userSubject = `Your ${body.courseTitle} Brochure - ZecurX`;
        else if (isInternship) userSubject = `Internship Enrollment Confirmed: ${body.itemName} - ZecurX`;
        else if (isPurchase) userSubject = `Order Confirmation: ${body.itemName} - ZecurX`;
        else if (isContact && preferredDate) userSubject = 'Meeting Request Received - ZecurX';

        let userMessage = '';
        if (isDemo) {
            userMessage = 'We have received your demo request and our team will get back to you within 24 hours to schedule a personalized demo.';
        } else if (isBrochure) {
            userMessage = `Thank you for your interest in <strong>${body.courseTitle}</strong>. We've attached the course brochure to this email for your convenience. You can also view it directly in your browser.`;
        } else if (isInternship) {
            userMessage = `Congratulations! You have successfully enrolled in the <strong>${body.itemName}</strong>. <br><br> Your payment of <strong>₹${body.price}</strong> was successful (ID: ${body.paymentId}). <br><br> Our team will contact you shortly with onboarding details, schedule, and access credentials. Welcome to ZecurX!`;
        } else if (isPurchase) {
            userMessage = `Thank you for your purchase of <strong>${body.itemName}</strong>. <br><br> Your payment of <strong>₹${body.price}</strong> was successful (ID: ${body.paymentId}). <br><br> You will receive further instructions shortly regarding access/shipping.`;
        } else if (isContact && preferredDate) {
            userMessage = `We have received your message and meeting request. Our team will confirm the meeting for <strong>${new Date(preferredDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</strong> and get back to you shortly.`;
        } else {
            userMessage = 'We have received your message and will get back to you as soon as possible.';
        }

        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                <h2 style="color: #1a1a1a;">Thank you, ${name}!</h2>
                <p style="color: #555;">
                    ${userMessage}
                </p>
                
                ${(isDemo || (isContact && preferredDate)) ? calendarHtml : ''}
                ${isDemo && attachments.length > 0 ? `<p style="color: #555; margin-top: 20px;"><strong>📎 We have attached our ${body.service || 'service'} brochure for your reference.</strong></p>` : ''}
                ${isBrochure && attachments.length > 0 ? `<p style="color: #555; margin-top: 20px;"><strong>📎 Your ${body.courseTitle} brochure is attached to this email.</strong></p>` : ''}

                <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    Best regards,<br>The ZecurX Team
                </p>
            </div>
        `;

        // Send user confirmation email
        let userEmailSent = false;
        try {
            console.log('Attempting to send user email to:', email);

            if ((isDemo || isBrochure) && attachments.length > 0) {
                await resend.emails.send({
                    from: 'ZecurX <official@zecurx.com>',
                    to: email,
                    subject: userSubject,
                    html: userEmailHtml,
                    attachments: attachments,
                });
            } else {
                await resend.emails.send({
                    from: 'ZecurX <official@zecurx.com>',
                    to: email,
                    subject: userSubject,
                    html: userEmailHtml,
                });
            }
            userEmailSent = true;
            console.log('User confirmation email sent successfully to:', email);
        } catch (userError) {
            console.error('Failed to send user confirmation email:', userError);
        }

        // Return response
        if (adminEmailSent && userEmailSent) {
            return NextResponse.json({
                success: true,
                message: 'Both emails sent successfully'
            });
        } else if (adminEmailSent) {
            return NextResponse.json({
                success: true,
                message: 'Admin notified. User confirmation may be delayed.',
                warning: 'User email failed to send'
            });
        } else {
            return NextResponse.json({
                success: true,
                message: 'Request received (email delivery pending)',
                warning: 'Email delivery issues detected'
            });
        }

    } catch (error) {
        console.error('Email API error:', error);

        return NextResponse.json({
            success: true,
            message: 'Request received',
            debugError: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
