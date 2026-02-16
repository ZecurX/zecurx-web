import { Metadata } from 'next';
import AcademyClient from './AcademyClient';

export const metadata: Metadata = {
    title: 'Cybersecurity Training & Certifications',
    description: 'ISO-verified cybersecurity certifications in ethical hacking, penetration testing, and AI security. Hands-on labs and expert instructors.',
    keywords: ['cybersecurity training', 'ethical hacking certification', 'penetration testing course', 'AI security training', 'ZecurX Academy'],
    openGraph: {
        title: 'ZecurX Academy - Cybersecurity Training & Certifications',
        description: 'ISO-verified cybersecurity certifications in ethical hacking, penetration testing, and AI security.',
        type: 'website',
        url: 'https://zecurx.com/academy',
    },
    alternates: {
        canonical: 'https://zecurx.com/academy',
    },
};

export default function AcademyPage() {
    return <AcademyClient />;
}
