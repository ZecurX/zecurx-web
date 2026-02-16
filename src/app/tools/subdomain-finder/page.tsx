import { Metadata } from 'next';
import SubdomainFinderClient from './SubdomainFinderClient';

export const metadata: Metadata = {
    title: 'Subdomain Finder | ZecurX',
    description: 'Discover subdomains of any domain. Enumerate hidden subdomains to map your attack surface and identify potential security risks.',
    keywords: ['subdomain finder', 'subdomain enumeration', 'attack surface', 'cybersecurity', 'ZecurX'],
    openGraph: {
        title: 'Subdomain Finder | ZecurX',
        description: 'Discover subdomains of any domain. Enumerate hidden subdomains to map your attack surface and identify potential security risks.',
        type: 'website',
        url: 'https://zecurx.com/tools/subdomain-finder',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools/subdomain-finder',
    },
};

export default function SubdomainFinderPage() {
    return <SubdomainFinderClient />;
}
