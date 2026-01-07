import Razorpay from 'razorpay';

// Currency settings
export const CURRENCY = 'INR';

// Lazy initialization - only creates instance when needed
let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error(
            'Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env.local file.'
        );
    }

    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    return razorpayInstance;
}

// Helper to convert amount to paise (Razorpay uses smallest currency unit)
export function amountToPaise(amount: number): number {
    return Math.round(amount * 100);
}

// Helper to convert paise to rupees for display
export function paiseToRupees(paise: number): number {
    return paise / 100;
}

