import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
    title: 'Register for Seminar | ZecurX',
    description: 'Register for a ZecurX cybersecurity seminar. Learn from industry experts and enhance your security skills.',
    keywords: ['seminar registration', 'cybersecurity seminar', 'security training', 'ZecurX'],
};

export default function RegisterPage() {
    return <RegisterClient />;
}
