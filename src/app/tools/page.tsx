import { Metadata } from 'next';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
    title: 'Security Tools | ZecurX',
    description: 'Free cybersecurity tools including header scanner, SSL analyzer, port radar, subdomain finder, directory scanner, and parameter finder.',
    keywords: ['security tools', 'cybersecurity', 'header scanner', 'SSL analyzer', 'port scanner', 'ZecurX'],
    openGraph: {
        title: 'Security Tools | ZecurX',
        description: 'Free cybersecurity tools including header scanner, SSL analyzer, port radar, subdomain finder, directory scanner, and parameter finder.',
        type: 'website',
        url: 'https://zecurx.com/tools',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools',
    },
};

export default function ToolsPage() {
    return <ToolsClient />;
}
