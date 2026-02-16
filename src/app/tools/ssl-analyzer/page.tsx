import { Metadata } from 'next';
import SSLAnalyzerClient from './SSLAnalyzerClient';

export const metadata: Metadata = {
    title: 'SSL/TLS Analyzer | ZecurX',
    description: 'Analyze SSL/TLS certificates and configurations. Check certificate validity, protocol support, and cipher suite security.',
    keywords: ['SSL analyzer', 'TLS checker', 'certificate analysis', 'cybersecurity', 'ZecurX'],
};

export default function SSLAnalyzerPage() {
    return <SSLAnalyzerClient />;
}
