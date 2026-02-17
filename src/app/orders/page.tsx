import { Metadata } from 'next';
import OrdersClient from './OrdersClient';

export const metadata: Metadata = {
    title: 'My Orders | ZecurX',
    description: 'View and track your order history. Check order status and download invoices.',
    keywords: ['orders', 'order history', 'purchases', 'ZecurX'],
    openGraph: {
        title: 'My Orders | ZecurX',
        description: 'View and track your order history. Check order status and download invoices.',
        type: 'website',
        url: 'https://zecurx.com/orders',
    },
    alternates: {
        canonical: 'https://zecurx.com/orders',
    },
};

export default function OrdersPage() {
    return <OrdersClient />;
}
