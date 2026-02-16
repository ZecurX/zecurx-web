import { Metadata } from 'next';
import OrdersClient from './OrdersClient';

export const metadata: Metadata = {
    title: 'My Orders | ZecurX',
    description: 'View and track your order history. Check order status and download invoices.',
    keywords: ['orders', 'order history', 'purchases', 'ZecurX'],
};

export default function OrdersPage() {
    return <OrdersClient />;
}
