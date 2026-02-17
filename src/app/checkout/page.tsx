import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
    title: 'Checkout | ZecurX',
    description: 'Complete your purchase securely. Enter your details and finalize your order.',
    keywords: ['checkout', 'payment', 'purchase', 'ZecurX'],
    openGraph: {
        title: 'Checkout | ZecurX',
        description: 'Complete your purchase securely. Enter your details and finalize your order.',
        type: 'website',
        url: 'https://zecurx.com/checkout',
    },
    alternates: {
        canonical: 'https://zecurx.com/checkout',
    },
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
