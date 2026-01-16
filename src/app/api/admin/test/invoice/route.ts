import { NextResponse } from 'next/server';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice';

export async function POST() {
    try {
        const invoiceNumber = generateInvoiceNumber();

        const pdfBuffer = await generateInvoicePDF({
            invoiceNumber,
            date: new Date(),
            customerName: 'Test Customer',
            customerEmail: 'test@example.com',
            customerPhone: '+91 98765 43210',
            customerCollege: 'Test University',
            itemName: 'Test Internship Program',
            itemDescription: 'This is a test invoice generated from the admin system test panel.',
            amount: 3200,
            paymentId: 'pay_TEST_' + Date.now(),
            orderId: 'order_TEST_' + Date.now(),
        });

        const pdfBase64 = pdfBuffer.toString('base64');

        return NextResponse.json({
            success: true,
            message: 'Invoice PDF generated successfully',
            pdfBase64,
            details: {
                invoiceNumber,
                fileSize: `${(pdfBuffer.length / 1024).toFixed(2)} KB`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate invoice',
            },
            { status: 500 }
        );
    }
}
