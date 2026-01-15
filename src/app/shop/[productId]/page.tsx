'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Truck, Shield, Check, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { getProductImages } from '@/lib/productImages';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    images: string[];
    stock: number;
    delivery_days: number;
    features: string[];
    tags: string[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.productId as string;
    const { addItem } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) throw new Error('Product not found');
                
                const data = await response.json();
                setProduct(data.product);
                setRelatedProducts(data.related || []);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            deliveryDays: product.delivery_days,
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <CreativeNavBar />
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
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <CreativeNavBar />
                <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <AlertCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-semibold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const allImages = getProductImages(product.name, product.image, product.images);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <CreativeNavBar />

            <section className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">{product.name}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="aspect-square bg-muted/30 rounded-3xl overflow-hidden border border-border/40 relative">
                                <img
                                    src={allImages[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8"
                                />
                                
                                {product.stock <= 5 && product.stock > 0 && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
                                        <AlertCircle className="w-3 h-3" />
                                        Only {product.stock} left
                                    </div>
                                )}
                            </div>

                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                                selectedImage === index 
                                                    ? 'border-primary' 
                                                    : 'border-border/40 hover:border-border'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-contain p-2 bg-muted/30"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs uppercase tracking-wider font-bold bg-muted/50 border border-border/50 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold font-manrope">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                </span>
                                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full font-semibold transition-all duration-300 ${
                                        isAdded
                                            ? 'bg-green-500 text-white'
                                            : product.stock === 0
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-foreground text-background hover:opacity-90'
                                    }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`p-4 rounded-full border transition-all ${
                                        isWishlisted 
                                            ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                            : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-muted/50">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Free Shipping</p>
                                        <p className="text-xs text-muted-foreground">~{product.delivery_days} days delivery</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-muted/50">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Authentic Product</p>
                                        <p className="text-xs text-muted-foreground">100% guaranteed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="font-semibold mb-4">Key Features</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="py-20 border-t border-border/40">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((related, index) => (
                                <ProductCard
                                    key={related.id}
                                    id={related.id}
                                    name={related.name}
                                    price={related.price}
                                    description={related.description}
                                    image={related.image}
                                    images={related.images}
                                    stock={related.stock}
                                    features={related.features}
                                    tags={related.tags}
                                    deliveryDays={related.delivery_days}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
