import { Metadata } from 'next';
import SubdomainFinderClient from './SubdomainFinderClient';

export const metadata: Metadata = {
    title: 'Subdomain Finder | ZecurX',
    description: 'Discover subdomains of any domain. Enumerate hidden subdomains to map your attack surface and identify potential security risks.',
    keywords: ['subdomain finder', 'subdomain enumeration', 'attack surface', 'cybersecurity', 'ZecurX'],
};

export default function SubdomainFinderPage() {
    return <SubdomainFinderClient />;
}
