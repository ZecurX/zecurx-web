import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface InvoiceData {
    invoiceNumber: string;
    date: Date;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerCollege?: string;
    itemName: string;
    itemDescription?: string;
    amount: number;
    paymentId: string;
    orderId?: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    
    const darkGray = rgb(0.2, 0.2, 0.2);
    const mediumGray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.6, 0.6, 0.6);
    const accentColor = rgb(0.1, 0.4, 0.8);
    
    page.drawRectangle({
        x: 0,
        y: height - 120,
        width: width,
        height: 120,
        color: rgb(0.05, 0.05, 0.1),
    });
    
    page.drawText('ZECURX', {
        x: margin,
        y: height - 60,
        size: 32,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });
    
    page.drawText('Cybersecurity Solutions', {
        x: margin,
        y: height - 85,
        size: 12,
        font: helvetica,
        color: rgb(0.7, 0.7, 0.7),
    });
    
    page.drawText('INVOICE', {
        x: width - margin - 100,
        y: height - 60,
        size: 24,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });
    
    y = height - 160;
    
    page.drawText(`Invoice #: ${data.invoiceNumber}`, {
        x: margin,
        y,
        size: 11,
        font: helveticaBold,
        color: darkGray,
    });
    
    page.drawText(`Date: ${data.date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    })}`, {
        x: width - margin - 150,
        y,
        size: 11,
        font: helvetica,
        color: mediumGray,
    });
    
    y -= 40;
    
    page.drawText('BILL TO:', {
        x: margin,
        y,
        size: 10,
        font: helveticaBold,
        color: accentColor,
    });
    
    y -= 20;
    page.drawText(data.customerName, {
        x: margin,
        y,
        size: 12,
        font: helveticaBold,
        color: darkGray,
    });
    
    y -= 18;
    page.drawText(data.customerEmail, {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: mediumGray,
    });
    
    if (data.customerPhone) {
        y -= 16;
        page.drawText(`Phone: ${data.customerPhone}`, {
            x: margin,
            y,
            size: 10,
            font: helvetica,
            color: mediumGray,
        });
    }
    
    if (data.customerCollege) {
        y -= 16;
        page.drawText(`Institution: ${data.customerCollege}`, {
            x: margin,
            y,
            size: 10,
            font: helvetica,
            color: mediumGray,
        });
    }
    
    y -= 40;
    
    const tableTop = y;
    const tableWidth = width - (margin * 2);
    const col1Width = tableWidth * 0.6;
    const col2Width = tableWidth * 0.2;
    const _col3Width = tableWidth * 0.2;
    
    page.drawRectangle({
        x: margin,
        y: tableTop - 25,
        width: tableWidth,
        height: 25,
        color: rgb(0.95, 0.95, 0.95),
    });
    
    page.drawText('DESCRIPTION', {
        x: margin + 10,
        y: tableTop - 17,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });
    
    page.drawText('QTY', {
        x: margin + col1Width + 10,
        y: tableTop - 17,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });
    
    page.drawText('AMOUNT', {
        x: margin + col1Width + col2Width + 10,
        y: tableTop - 17,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });
    
    y = tableTop - 50;
    
    page.drawText(data.itemName, {
        x: margin + 10,
        y,
        size: 11,
        font: helvetica,
        color: darkGray,
    });
    
    if (data.itemDescription) {
        y -= 15;
        const descLines = splitTextToLines(data.itemDescription, 50);
        for (const line of descLines) {
            page.drawText(line, {
                x: margin + 10,
                y,
                size: 9,
                font: helvetica,
                color: lightGray,
            });
            y -= 12;
        }
        y += 12;
    }
    
    page.drawText('1', {
        x: margin + col1Width + 25,
        y: tableTop - 50,
        size: 11,
        font: helvetica,
        color: darkGray,
    });
    
    page.drawText(`INR ${data.amount.toLocaleString('en-IN')}`, {
        x: margin + col1Width + col2Width + 10,
        y: tableTop - 50,
        size: 11,
        font: helvetica,
        color: darkGray,
    });
    
    y -= 30;
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
    });
    
    y -= 25;
    
    page.drawText('Subtotal:', {
        x: width - margin - 150,
        y,
        size: 10,
        font: helvetica,
        color: mediumGray,
    });
    page.drawText(`INR ${data.amount.toLocaleString('en-IN')}`, {
        x: width - margin - 70,
        y,
        size: 10,
        font: helvetica,
        color: darkGray,
    });
    
    y -= 20;
    page.drawText('Tax (0%):', {
        x: width - margin - 150,
        y,
        size: 10,
        font: helvetica,
        color: mediumGray,
    });
    page.drawText('INR 0', {
        x: width - margin - 60,
        y,
        size: 10,
        font: helvetica,
        color: darkGray,
    });
    
    y -= 25;
    page.drawRectangle({
        x: width - margin - 160,
        y: y - 5,
        width: 160,
        height: 25,
        color: rgb(0.05, 0.05, 0.1),
    });
    
    page.drawText('TOTAL:', {
        x: width - margin - 150,
        y: y + 3,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });
    page.drawText(`INR ${data.amount.toLocaleString('en-IN')}`, {
        x: width - margin - 70,
        y: y + 3,
        size: 11,
        font: helveticaBold,
        color: rgb(1, 1, 1),
    });
    
    y -= 60;
    
    page.drawText('PAYMENT DETAILS', {
        x: margin,
        y,
        size: 10,
        font: helveticaBold,
        color: accentColor,
    });
    
    y -= 20;
    page.drawText(`Payment ID: ${data.paymentId}`, {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: mediumGray,
    });
    
    if (data.orderId) {
        y -= 16;
        page.drawText(`Order ID: ${data.orderId}`, {
            x: margin,
            y,
            size: 10,
            font: helvetica,
            color: mediumGray,
        });
    }
    
    y -= 16;
    page.drawText('Status: PAID', {
        x: margin,
        y,
        size: 10,
        font: helveticaBold,
        color: rgb(0.1, 0.6, 0.3),
    });
    
    y -= 16;
    page.drawText('Payment Method: Razorpay', {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: mediumGray,
    });
    
    const footerY = 80;
    
    page.drawLine({
        start: { x: margin, y: footerY + 20 },
        end: { x: width - margin, y: footerY + 20 },
        thickness: 1,
        color: rgb(0.9, 0.9, 0.9),
    });
    
    page.drawText('ZecurX Private Limited', {
        x: margin,
        y: footerY,
        size: 9,
        font: helveticaBold,
        color: darkGray,
    });
    
    page.drawText('www.zecurx.com | official@zecurx.com', {
        x: margin,
        y: footerY - 14,
        size: 8,
        font: helvetica,
        color: lightGray,
    });
    
    page.drawText('Thank you for your business!', {
        x: width - margin - 120,
        y: footerY,
        size: 9,
        font: helvetica,
        color: mediumGray,
    });
    
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}

function splitTextToLines(text: string, maxChars: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxChars) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines;
}

export function generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ZX-${year}${month}-${random}`;
}
