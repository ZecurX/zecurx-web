import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
    title: 'Register for Seminar | ZecurX',
    description: 'Register for a ZecurX cybersecurity seminar. Learn from industry experts and enhance your security skills.',
    keywords: ['seminar registration', 'cybersecurity seminar', 'security training', 'ZecurX'],
    openGraph: {
        title: 'Register for Seminar | ZecurX',
        description: 'Register for a ZecurX cybersecurity seminar. Learn from industry experts and enhance your security skills.',
        type: 'website',
        url: 'https://zecurx.com/seminars',
    },
    alternates: {
        canonical: 'https://zecurx.com/seminars',
    },
};

export default function RegisterPage() {
    return <RegisterClient />;
}
