import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | ZecurX',
    description: 'Read our privacy policy to understand how ZecurX collects, uses, and protects your personal information.',
    keywords: ['privacy policy', 'data protection', 'personal information', 'ZecurX'],
    openGraph: {
        title: 'Privacy Policy | ZecurX',
        description: 'Read our privacy policy to understand how ZecurX collects, uses, and protects your personal information.',
        type: 'website',
        url: 'https://zecurx.com/privacy-policy',
    },
    alternates: {
        canonical: 'https://zecurx.com/privacy-policy',
    },
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyClient />;
}
