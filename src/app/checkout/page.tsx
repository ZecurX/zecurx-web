import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
    title: 'Checkout | ZecurX',
    description: 'Complete your purchase securely. Enter your details and finalize your order.',
    keywords: ['checkout', 'payment', 'purchase', 'ZecurX'],
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
