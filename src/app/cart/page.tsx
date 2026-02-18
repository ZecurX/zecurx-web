import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
    title: 'Shopping Cart | ZecurX',
    description: 'Review and manage items in your shopping cart before proceeding to checkout.',
    keywords: ['cart', 'shopping cart', 'ZecurX'],
    openGraph: {
        title: 'Shopping Cart | ZecurX',
        description: 'Review and manage items in your shopping cart before proceeding to checkout.',
        type: 'website',
        url: 'https://zecurx.com/cart',
    },
    alternates: {
        canonical: 'https://zecurx.com/cart',
    },
};

export default function CartPage() {
    return <CartClient />;
}
