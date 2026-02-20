'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Ticket, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    // Referral code state
    const [referralCode, setReferralCode] = useState('');
    const [appliedCode, setAppliedCode] = useState<{
        code: string;
        discount_type: 'percentage' | 'fixed';
        discount_amount: number;
        isPartnerReferral?: boolean;
    } | null>(null);
    const [referralError, setReferralError] = useState('');
    const [validatingCode, setValidatingCode] = useState(false);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const maxDeliveryDays = items.length > 0
        ? Math.max(...items.map(item => item.deliveryDays || 20))
        : 0;

    const finalAmount = appliedCode ? totalPrice - appliedCode.discount_amount : totalPrice;

    const handleApplyReferralCode = async () => {
        if (!referralCode.trim()) return;

        setValidatingCode(true);
        setReferralError('');

        try {
            const res = await fetch('/api/referral-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: referralCode.trim(),
                    order_amount: totalPrice
                })
            });

            const data = await res.json();

            if (data.valid) {
                setAppliedCode({
                    code: data.code,
                    discount_type: data.discount_type,
                    discount_amount: data.discount_amount,
                    isPartnerReferral: data.isPartnerReferral || false
                });
                setReferralCode('');
            } else {
                setReferralError(data.error || 'Invalid code');
            }
        } catch {
            setReferralError('Failed to validate code');
        } finally {
            setValidatingCode(false);
        }
    };

    const handleRemoveReferralCode = () => {
        setAppliedCode(null);
        setReferralError('');
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <CreativeNavBar />

            <section className="pt-32 pb-20 min-h-[80vh]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-manrope mb-4">
                            Your Cart
                        </h1>
                        <p className="text-muted-foreground">
                            {totalItems === 0
                                ? 'Your cart is empty'
                                : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`
                            }
                        </p>
                    </motion.div>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 border border-dashed border-border/30 rounded-3xl bg-muted/5"
                        >
                            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:opacity-90 transition-opacity"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, height: 0 }}
                                            className="flex gap-6 p-6 bg-card/50 border border-border/40 rounded-2xl"
                                        >
                                            <div className="w-24 h-24 rounded-xl bg-muted/50 overflow-hidden shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-foreground mb-1 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Delivery in ~{item.deliveryDays} days
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-border/50 rounded-full overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 hover:bg-muted/50 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-4 font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 hover:bg-muted/50 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-lg">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatPrice(item.price)} each
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <div className="flex justify-between items-center pt-4">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Continue Shopping
                                    </Link>

                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="sticky top-32 p-6 bg-card border border-border/50 rounded-2xl"
                                >
                                    <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="text-green-500">Free</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Est. Delivery</span>
                                            <span>~{maxDeliveryDays} days</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-border/50 pt-4 mb-6">
                                        {/* Referral Code Section */}
                                        <div className="mb-4">
                                            {appliedCode ? (
                                                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Ticket className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm font-medium text-green-500">{appliedCode.code}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-green-500">-{formatPrice(appliedCode.discount_amount)}</span>
                                                        <button
                                                            onClick={handleRemoveReferralCode}
                                                            className="p-1 hover:bg-green-500/20 rounded transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5 text-green-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                value={referralCode}
                                                                onChange={(e) => {
                                                                    setReferralCode(e.target.value.toUpperCase());
                                                                    setReferralError('');
                                                                }}
                                                                placeholder="Referral code"
                                                                className="w-full bg-muted/30 border border-border rounded-lg py-2 pl-10 pr-4 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={handleApplyReferralCode}
                                                            disabled={!referralCode.trim() || validatingCode}
                                                            className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors"
                                                        >
                                                            {validatingCode ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                'Apply'
                                                            )}
                                                        </button>
                                                    </div>
                                                    {referralError && (
                                                        <p className="text-xs text-red-500 ml-1">{referralError}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {appliedCode && (
                                            <div className="flex justify-between text-sm text-green-500 mb-2">
                                                <span>Discount</span>
                                                <span>-{formatPrice(appliedCode.discount_amount)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total</span>
                                            <span>{formatPrice(finalAmount)}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/checkout?cartCheckout=true&total=${totalPrice}${appliedCode ? `&referralCode=${appliedCode.code}` : ''}`}
                                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-foreground text-background rounded-full font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <p className="text-xs text-muted-foreground text-center mt-4">
                                        Secure checkout powered by Razorpay
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
