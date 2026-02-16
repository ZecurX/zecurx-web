import { Metadata } from 'next';
import CookiePolicyClient from './CookiePolicyClient';

export const metadata: Metadata = {
    title: 'Cookie Policy | ZecurX',
    description: 'Learn how ZecurX uses cookies and similar technologies on our website. Understand your choices regarding cookie usage.',
    keywords: ['cookie policy', 'cookies', 'privacy', 'ZecurX'],
};

export default function CookiePolicyPage() {
    return <CookiePolicyClient />;
}
