import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | ZecurX',
    description: 'Read our privacy policy to understand how ZecurX collects, uses, and protects your personal information.',
    keywords: ['privacy policy', 'data protection', 'personal information', 'ZecurX'],
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyClient />;
}
