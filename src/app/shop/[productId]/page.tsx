import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';

interface Props {
    params: Promise<{ productId: string }>;
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
