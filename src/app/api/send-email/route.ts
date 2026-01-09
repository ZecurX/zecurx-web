import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { appendToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message, formType } = body;

        // Validate required fields
        if (!name || !email || (!message && formType !== 'brochure' && formType !== 'purchase')) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Email content based on form type
        // Email content based on form type
        const isDemo = formType === 'demo';
        const isBrochure = formType === 'brochure';
        const isPurchase = formType === 'purchase';

        // Check if purchase is an internship
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
                // Determine course/item name
                let courseName = body.itemName || 'Unknown Item';
                if (isInternship && body.courseTitle) courseName = body.courseTitle;

                await appendToSheet({
                    name,
                    email,
                    mobile: body.mobile || '',
                    course: courseName,
                    price: body.price || 0,
                    paymentId: body.paymentId || '',
                    date: new Date().toISOString()
                });
            } catch (sheetError) {
                console.error('Failed to save to Google Sheets:', sheetError);
                // Don't block email sending if sheet fails
            }
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">
                    ${isDemo ? '🎯 New Demo Request' : isBrochure ? '📄 Brochure Download Request' : isInternship ? '🎓 New Internship Enrollment' : isPurchase ? '💰 New Purchase' : '📧 New Contact Message'}
                </h2>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                    ${body.mobile ? `<p style="margin: 0 0 10px 0;"><strong>Mobile:</strong> ${body.mobile}</p>` : ''}
                    
                    ${isBrochure && body.courseTitle ? `<p style="margin: 0 0 10px 0;"><strong>Course:</strong> ${body.courseTitle}</p>` : ''}
                    ${isPurchase && body.itemName ? `<p style="margin: 0 0 10px 0;"><strong>Item:</strong> ${body.itemName}</p>` : ''}
                    ${isPurchase && body.price ? `<p style="margin: 0 0 10px 0;"><strong>Price:</strong> ₹${body.price}</p>` : ''}
                    ${isPurchase && body.paymentId ? `<p style="margin: 0 0 10px 0;"><strong>Payment ID:</strong> ${body.paymentId}</p>` : ''}
                    
                    ${body.company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${body.company}</p>` : ''}
                    ${body.role ? `<p style="margin: 0 0 10px 0;"><strong>Role:</strong> ${body.role}</p>` : ''}
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

        // Send email to Admin
        await transporter.sendMail({
            from: `"ZecurX Website" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL,
            replyTo: email,
            subject: emailSubject,
            html: htmlContent,
        });

        // Send confirmation email to user
        let userSubject = 'We received your message - ZecurX';
        if (isDemo) userSubject = 'Demo Request Received - ZecurX';
        if (isBrochure) userSubject = `Your ${body.courseTitle} Brochure - ZecurX`;
        if (isInternship) userSubject = `Internship Enrollment Confirmed: ${body.itemName} - ZecurX`;
        else if (isPurchase) userSubject = `Order Confirmation: ${body.itemName} - ZecurX`;

        let userMessage = '';
        if (isDemo) {
            userMessage = 'We have received your demo request and our team will get back to you within 24 hours to schedule a personalized demo.';
        } else if (isBrochure) {
            userMessage = `Thank you for your interest in <strong>${body.courseTitle}</strong>. You should have received the brochure download in your browser.`;
        } else if (isInternship) {
            userMessage = `Congratulations! You have successfully enrolled in the <strong>${body.itemName}</strong>. <br><br> Your payment of <strong>₹${body.price}</strong> was successful (ID: ${body.paymentId}). <br><br> Our team will contact you shortly with onboarding details, schedule, and access credentials. Welcome to ZecurX!`;
        } else if (isPurchase) {
            userMessage = `Thank you for your purchase of <strong>${body.itemName}</strong>. <br><br> Your payment of <strong>₹${body.price}</strong> was successful (ID: ${body.paymentId}). <br><br> You will receive further instructions shortly regarding access/shipping.`;
        } else {
            userMessage = 'We have received your message and will get back to you as soon as possible.';
        }

        await transporter.sendMail({
            from: `"ZecurX" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: userSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1a1a1a;">Thank you, ${name}!</h2>
                    <p style="color: #555; line-height: 1.6;">
                        ${userMessage}
                    </p>
                    <p style="color: #555;">Best regards,<br>The ZecurX Team</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}
