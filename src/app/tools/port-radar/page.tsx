import { Metadata } from 'next';
import PortRadarClient from './PortRadarClient';

export const metadata: Metadata = {
    title: 'Port Radar | ZecurX',
    description: 'Scan and discover open ports on any target. Identify running services and potential security vulnerabilities.',
    keywords: ['port scanner', 'port radar', 'open ports', 'network security', 'ZecurX'],
    openGraph: {
        title: 'Port Radar | ZecurX',
        description: 'Scan and discover open ports on any target. Identify running services and potential security vulnerabilities.',
        type: 'website',
        url: 'https://zecurx.com/tools/port-radar',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools/port-radar',
    },
};

export default function PortRadarPage() {
    return <PortRadarClient />;
}
