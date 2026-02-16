import { Metadata } from 'next';
import HeaderScannerClient from './HeaderScannerClient';

export const metadata: Metadata = {
    title: 'HTTP Header Scanner | ZecurX',
    description: 'Analyze HTTP security headers of any website. Check for missing or misconfigured headers that could expose your site to attacks.',
    keywords: ['header scanner', 'HTTP headers', 'security headers', 'cybersecurity', 'ZecurX'],
    openGraph: {
        title: 'HTTP Header Scanner | ZecurX',
        description: 'Analyze HTTP security headers of any website. Check for missing or misconfigured headers that could expose your site to attacks.',
        type: 'website',
        url: 'https://zecurx.com/tools/header-scanner',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools/header-scanner',
    },
};

export default function HeaderScannerPage() {
    return <HeaderScannerClient />;
}
