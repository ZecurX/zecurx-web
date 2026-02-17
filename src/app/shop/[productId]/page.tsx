import { Suspense } from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { query } from '@/lib/db';

interface Props {
    params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productId } = await params;

    try {
        const result = await query(
            'SELECT name, description, image_url FROM products WHERE id = $1 LIMIT 1',
            [productId]
        );
        const product = result.rows[0];

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The product you are looking for could not be found.',
            };
        }

        return {
            title: product.name,
            description: product.description?.slice(0, 155) || `${product.name} - Security hardware from ZecurX`,
            openGraph: {
                title: `${product.name} | ZecurX Shop`,
                description: product.description?.slice(0, 155) || `${product.name} - Security hardware from ZecurX`,
                type: 'website',
                images: product.image_url ? [{ url: product.image_url }] : [],
            },
            alternates: {
                canonical: `https://zecurx.com/shop/${productId}`,
            },
        };
    } catch {
        return {
            title: 'ZecurX Shop',
            description: 'Browse security hardware and tools.',
        };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { productId } = await params;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <CreativeNavBar />
            <Suspense fallback={
                <div className="pt-32 pb-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="aspect-square bg-muted/20 rounded-3xl animate-pulse" />
                            <div className="space-y-6">
                                <div className="h-8 bg-muted/20 rounded-lg w-3/4 animate-pulse" />
                                <div className="h-6 bg-muted/20 rounded-lg w-1/4 animate-pulse" />
                                <div className="h-24 bg-muted/20 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            }>
                <ProductDetailClient productId={productId} />
            </Suspense>
            <Footer />
        </main>
    );
}
