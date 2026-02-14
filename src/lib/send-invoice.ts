import { Resend } from 'resend';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice';

export interface InvoiceEmailData {
    name: string;
    email: string;
    itemName: string;
    amount: number;
    paymentId: string;
    orderId: string;
    phone?: string;
    college?: string;
    isInternship: boolean;
}

export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<void> {
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
                <img src="https://www.zecurx.com/images/zecurx-logo.png" alt="ZecurX" style="height: 40px; display: block; margin: 0 auto;" />
                <p style="color: #a0a0a0; margin: 15px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Cybersecurity Solutions</p>
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
                    © ${new Date().getFullYear()} ZecurX Private Limited. All rights reserved.<br>
                    <a href="https://www.zecurx.com" style="color: #2196f3; text-decoration: none;">www.zecurx.com</a>
                </p>
            </div>
        </div>
    `;

    await resend.emails.send({
        from: 'ZecurX Private Limited <official@zecurx.com>',
        to: data.email,
        subject: emailSubject,
        html: userEmailHtml,
        attachments: [{
            filename: `ZecurX-Invoice-${invoiceNumber}.pdf`,
            content: invoicePdf,
        }],
    });
    console.log(`Invoice email sent to: ${data.email}`);

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

    await resend.emails.send({
        from: 'ZecurX Private Limited <official@zecurx.com>',
        to: adminEmail,
        subject: `New ${data.isInternship ? 'Enrollment' : 'Purchase'}: ${data.itemName} - ₹${data.amount}`,
        html: adminEmailHtml,
        attachments: [{
            filename: `ZecurX-Invoice-${invoiceNumber}.pdf`,
            content: invoicePdf,
        }],
    });
    console.log(`Admin notification sent to: ${adminEmail}`);
}
