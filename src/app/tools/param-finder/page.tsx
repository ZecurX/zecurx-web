import { Metadata } from 'next';
import ParamFinderClient from './ParamFinderClient';

export const metadata: Metadata = {
    title: 'Parameter Finder | ZecurX',
    description: 'Discover hidden URL parameters on any website. Find undocumented parameters that could be used in security testing.',
    keywords: ['parameter finder', 'URL parameters', 'hidden parameters', 'cybersecurity', 'ZecurX'],
    openGraph: {
        title: 'Parameter Finder | ZecurX',
        description: 'Discover hidden URL parameters on any website. Find undocumented parameters that could be used in security testing.',
        type: 'website',
        url: 'https://zecurx.com/tools/param-finder',
    },
    alternates: {
        canonical: 'https://zecurx.com/tools/param-finder',
    },
};

export default function ParamFinderPage() {
    return <ParamFinderClient />;
}
