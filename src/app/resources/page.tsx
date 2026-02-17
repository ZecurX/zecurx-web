import { Metadata } from 'next';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
    title: 'Resources - Security Insights & Knowledge',
    description: 'Expert cybersecurity insights, research, guides, seminars, and whitepapers from the ZecurX security team.',
    keywords: ['cybersecurity resources', 'security blog', 'whitepapers', 'security guides', 'seminars', 'threat intelligence'],
    openGraph: {
        title: 'Resources - Security Insights & Knowledge | ZecurX',
        description: 'Expert cybersecurity insights, research, guides, seminars, and whitepapers from the ZecurX security team.',
        type: 'website',
        url: 'https://zecurx.com/resources',
    },
    alternates: {
        canonical: 'https://zecurx.com/resources',
    },
};

export default function ResourcesPage() {
    return <ResourcesClient />;
}
