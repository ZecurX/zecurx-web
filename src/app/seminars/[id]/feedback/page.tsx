import { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
    title: 'Seminar Feedback | ZecurX',
    description: 'Share your feedback on the ZecurX seminar experience. Help us improve our cybersecurity training programs.',
    keywords: ['seminar feedback', 'cybersecurity training', 'feedback', 'ZecurX'],
    openGraph: {
        title: 'Seminar Feedback | ZecurX',
        description: 'Share your feedback on the ZecurX seminar experience. Help us improve our cybersecurity training programs.',
        type: 'website',
        url: 'https://zecurx.com/seminars',
    },
    alternates: {
        canonical: 'https://zecurx.com/seminars',
    },
};

export default function FeedbackPage() {
    return <FeedbackClient />;
}
