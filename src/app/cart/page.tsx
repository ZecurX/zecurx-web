import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
    title: 'Shopping Cart | ZecurX',
    description: 'Review and manage items in your shopping cart before proceeding to checkout.',
    keywords: ['cart', 'shopping cart', 'ZecurX'],
};

export default function CartPage() {
    return <CartClient />;
}
