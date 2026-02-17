import { Metadata } from 'next';
import CookiePolicyClient from './CookiePolicyClient';

export const metadata: Metadata = {
    title: 'Cookie Policy | ZecurX',
    description: 'Learn how ZecurX uses cookies and similar technologies on our website. Understand your choices regarding cookie usage.',
    keywords: ['cookie policy', 'cookies', 'privacy', 'ZecurX'],
    openGraph: {
        title: 'Cookie Policy | ZecurX',
        description: 'Learn how ZecurX uses cookies and similar technologies on our website.',
        type: 'website',
        url: 'https://zecurx.com/cookie-policy',
    },
    alternates: {
        canonical: 'https://zecurx.com/cookie-policy',
    },
};

export default function CookiePolicyPage() {
    return <CookiePolicyClient />;
}
