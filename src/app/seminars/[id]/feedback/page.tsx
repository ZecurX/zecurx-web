import { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const metadata: Metadata = {
    title: 'Seminar Feedback | ZecurX',
    description: 'Share your feedback on the ZecurX seminar experience. Help us improve our cybersecurity training programs.',
    keywords: ['seminar feedback', 'cybersecurity training', 'feedback', 'ZecurX'],
};

export default function FeedbackPage() {
    return <FeedbackClient />;
}
