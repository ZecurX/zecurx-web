import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Us | ZecurX',
    description: 'Get in touch with our cybersecurity experts. Reach out for sales inquiries, technical support, partnerships, or to schedule a consultation.',
    keywords: ['contact', 'cybersecurity', 'ZecurX', 'security consultation'],
    openGraph: {
        title: 'Contact Us | ZecurX',
        description: 'Get in touch with our cybersecurity experts. Reach out for sales inquiries, technical support, partnerships, or to schedule a consultation.',
        type: 'website',
        url: 'https://zecurx.com/contact',
    },
    alternates: {
        canonical: 'https://zecurx.com/contact',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
