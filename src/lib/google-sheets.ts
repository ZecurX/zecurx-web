import { google } from 'googleapis';

export interface StudentData {
    name: string;
    email: string;
    mobile: string;
    course: string;
    price: number | string;
    paymentId: string;
    date: string;
}

export async function appendToSheet(data: StudentData) {
    try {
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!clientEmail || !privateKey || !sheetId) {
            console.error('Google Sheets credentials missing');
            return false;
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:G', // Adjust range as needed, assumes columns A-G
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    data.date,
                    data.name,
                    data.email,
                    data.mobile,
                    data.course,
                    data.price,
                    data.paymentId
                ]],
            },
        });

        return true;
    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
        return false;
    }
}
