import { Metadata } from 'next';
import CertificateClient from './CertificateClient';

export const metadata: Metadata = {
    title: 'Seminar Certificate | ZecurX',
    description: 'View and download your ZecurX seminar completion certificate.',
    keywords: ['certificate', 'seminar certificate', 'cybersecurity certification', 'ZecurX'],
};

export default function CertificatePage() {
    return <CertificateClient />;
}
