import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Shield, Zap, Package, ArrowRight } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import ProductGrid from '@/components/shop/ProductGrid';
import CartIcon from '@/components/shop/CartIcon';
import { query } from '@/lib/db';
import { CartAnimationProvider } from '@/context/CartAnimationContext';

export const metadata: Metadata = {
    title: 'Security Hardware Store',
    description: 'Pro-grade hardware for security research. Authentic penetration testing tools, RFID analyzers, and network auditing equipment.',
    keywords: ['security hardware', 'penetration testing tools', 'hacking hardware', 'RFID tools', 'network auditing'],
    openGraph: {
        title: 'Security Hardware Store | ZecurX',
        description: 'Pro-grade hardware for security research. Authentic penetration testing tools and network auditing equipment.',
        type: 'website',
        url: 'https://zecurx.com/shop',
    },
    alternates: {
        canonical: 'https://zecurx.com/shop',
    },
};

interface ShopProduct {
    id: string;
    name: string;
    price: number | string;
    description: string;
    image: string;
    images?: string[];
    stock: number;
    delivery_days?: number;
    features?: string[];
    tags?: string[];
    created_at: string;
}

async function getProducts() {
    try {
        const result = await query<ShopProduct>(`
            SELECT * FROM products 
            ORDER BY created_at DESC
        `);
        return result.rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [] as ShopProduct[];
    }
}

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <CartAnimationProvider>
            <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
                <CreativeNavBar />

                <div className="fixed bottom-8 right-8 z-50" id="cart-icon-container">
                    <CartIcon />
                </div>

                <section className="relative pt-40 pb-20 overflow-hidden min-h-[50vh] flex items-center">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-primary/10 blur-[120px] rounded-full z-10" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center">
                        <div className="max-w-4xl flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 mb-6 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Official Store</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold font-manrope text-foreground mb-6 tracking-tight leading-[1.1]">
                                Pro-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Hardware</span>
                                <br />
                                <span className="text-4xl md:text-6xl text-muted-foreground font-light">for Security Research</span>
                            </h1>

                            <p className="text-xl text-muted-foreground font-light max-w-2xl mb-10 leading-relaxed font-manrope">
                                Equip yourself with industry-standard tools for penetration testing, RFID analysis, and network auditing.
                            </p>
                        </div>
                    </div>
                </section>

                <Suspense fallback={
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-muted/20 rounded-3xl h-[400px] animate-pulse border border-border/20" />
                            ))}
                        </div>
                    </div>
                }>
                    <ProductGrid initialProducts={products} />
                </Suspense>

                <section className="py-24 border-t border-border/40 bg-muted/10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-manrope">Why Choose ZecurX?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">Verified hardware for serious security professionals.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-colors group shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    <Shield className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Authentic Hardware</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Sourced directly from manufacturers like Hak5, Great Scott Gadgets, and more. 100% genuine components guaranteed.
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-colors group md:col-span-2 relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 h-full">
                                    <div className="flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                                            <Zap className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3">Instant Knowledge Access</h3>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            Every hardware purchase comes with exclusive access to ZecurX Academy tutorials, setup guides, and attack vectors for that specific tool.
                                        </p>
                                        <a href="/academy" className="inline-flex items-center text-sm font-bold text-foreground border-b border-primary pb-0.5 hover:text-primary transition-colors">
                                            View Academy Preview <ArrowRight className="w-4 h-4 ml-2" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-colors group shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                                    <Package className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Discreet Shipping</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Plain packaging for privacy. Tracked express shipping across India. Your operational security is our priority.
                                </p>
                            </div>

                            <div className="md:col-span-2 p-8 rounded-3xl bg-foreground text-background transition-colors group relative overflow-hidden flex items-center shadow-lg">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                <div className="relative z-10 w-full flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Need a Custom Loadout?</h3>
                                        <p className="text-background/70">Contact our sales team for bulk orders or enterprise kits.</p>
                                    </div>
                                    <a href="/contact" className="px-6 py-3 bg-background text-foreground font-bold rounded-full hover:bg-background/90 transition-colors">
                                        Contact Sales
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </CartAnimationProvider>
    );
}
