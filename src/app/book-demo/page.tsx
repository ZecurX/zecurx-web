import { Metadata } from 'next';
import BookDemoClient from './BookDemoClient';

export const metadata: Metadata = {
    title: 'Book a Demo',
    description: 'Schedule a personalized demo with ZecurX. See how we can secure your applications, cloud infrastructure, and AI systems.',
    keywords: ['book demo', 'cybersecurity demo', 'security assessment', 'ZecurX demo'],
    openGraph: {
        title: 'Book a Demo | ZecurX',
        description: 'Schedule a personalized demo with ZecurX. See how we can secure your applications, cloud infrastructure, and AI systems.',
        type: 'website',
        url: 'https://zecurx.com/book-demo',
    },
    alternates: {
        canonical: 'https://zecurx.com/book-demo',
    },
};

export default function BookDemoPage() {
    return <BookDemoClient />;
}
