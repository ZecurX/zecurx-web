import { Metadata } from 'next';
import SSLAnalyzerClient from './SSLAnalyzerClient';

export const metadata: Metadata = {
    title: 'SSL/TLS Analyzer | ZecurX',
    description: 'Analyze SSL/TLS certificates and configurations. Check certificate validity, protocol support, and cipher suite security.',
    keywords: ['SSL analyzer', 'TLS checker', 'certificate analysis', 'cybersecurity', 'ZecurX'],
    openGraph: {
        title: 'SSL/TLS Analyzer | ZecurX',
        description: 'Analyze SSL/TLS certificates and configurations. Check certificate validity, protocol support, and cipher suite security.',
        type: 'website',
        url: 'https://zecurx.com/tools/ssl-analyzer',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools/ssl-analyzer',
    },
};

export default function SSLAnalyzerPage() {
    return <SSLAnalyzerClient />;
}
