import { Metadata } from 'next';
import TermsOfServiceClient from './TermsOfServiceClient';

export const metadata: Metadata = {
    title: 'Terms of Service | ZecurX',
    description: 'Review the terms and conditions governing the use of ZecurX services and website.',
    keywords: ['terms of service', 'terms and conditions', 'legal', 'ZecurX'],
};

export default function TermsOfServicePage() {
    return <TermsOfServiceClient />;
}
