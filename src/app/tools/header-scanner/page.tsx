import { Metadata } from 'next';
import HeaderScannerClient from './HeaderScannerClient';

export const metadata: Metadata = {
    title: 'HTTP Header Scanner | ZecurX',
    description: 'Analyze HTTP security headers of any website. Check for missing or misconfigured headers that could expose your site to attacks.',
    keywords: ['header scanner', 'HTTP headers', 'security headers', 'cybersecurity', 'ZecurX'],
};

export default function HeaderScannerPage() {
    return <HeaderScannerClient />;
}
