"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, ArrowLeft, Mail, Phone, User as UserIcon, CheckCircle2, GraduationCap, MapPin, Ticket, X, Loader2 } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import { useCart } from '@/context/CartContext';

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: { name?: string; email?: string; contact?: string; };
    theme?: { color?: string; };
    modal?: { ondismiss?: () => void; };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { items, totalPrice, totalItems, clearCart } = useCart();

    const isCartCheckout = searchParams.get('cartCheckout') === 'true';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        city: '',
        pincode: '',
        college: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Referral code state
    const [referralCode, setReferralCode] = useState('');
    const [appliedCode, setAppliedCode] = useState<{
        code: string;
        discount_type: 'percentage' | 'fixed';
        discount_amount: number;
        isPartnerReferral: boolean;
        partnerName?: string;
    } | null>(null);
    const [referralError, setReferralError] = useState('');
    const [validatingCode, setValidatingCode] = useState(false);

    const [promoPrice, setPromoPrice] = useState<number | null>(null);
    const [promoPriceValid, setPromoPriceValid] = useState<boolean | null>(null);
    const [promoPriceError, setPromoPriceError] = useState('');
    const [originalPlanPrice, setOriginalPlanPrice] = useState<number | null>(null);
    const [resolvedPromoCode, setResolvedPromoCode] = useState<string | null>(null);

    const urlPromoPrice = searchParams.get('promoPrice');
    const urlPromoCode = searchParams.get('promoCode');
    const itemId = searchParams.get('itemId') || '';
    const itemType = searchParams.get('type') || 'course';

    const [fetchedItem, setFetchedItem] = useState<{
        id: string;
        name: string;
        price: number;
        type: string;
    } | null>(null);
    const [isLoadingItem, setIsLoadingItem] = useState(!isCartCheckout && !!itemId);
    const [itemFetchError, setItemFetchError] = useState('');

    useEffect(() => {
        const fetchItemPrice = async () => {
            if (isCartCheckout || !itemId) return;

            setIsLoadingItem(true);
            setItemFetchError('');

            try {
                const res = await fetch(`/api/checkout/item-price?itemId=${encodeURIComponent(itemId)}&type=${encodeURIComponent(itemType)}`);
                const data = await res.json();

                if (!res.ok || data.error) {
                    setItemFetchError(data.error || 'Failed to load item');
                    return;
                }

                setFetchedItem({
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    type: data.type
                });
            } catch {
                setItemFetchError('Failed to load item details');
            } finally {
                setIsLoadingItem(false);
            }
        };

        fetchItemPrice();
    }, [itemId, itemType, isCartCheckout]);

    const singleItem = !isCartCheckout && fetchedItem ? {
        id: fetchedItem.id,
        name: fetchedItem.name,
        price: promoPriceValid && promoPrice ? promoPrice : fetchedItem.price,
        type: fetchedItem.type
    } : null;

    const checkoutAmount = isCartCheckout ? totalPrice : (singleItem?.price || 0);
    const finalAmount = appliedCode ? checkoutAmount - appliedCode.discount_amount : checkoutAmount;
    const checkoutItemName = isCartCheckout
        ? `${totalItems} item${totalItems > 1 ? 's' : ''} from ZecurX Shop`
        : (singleItem?.name || '');

    // Validate referral code - checks both regular and partner referral codes
    const validateCode = async (codeToValidate: string) => {
        if (!codeToValidate.trim()) return;

        setValidatingCode(true);
        setReferralError('');

        try {
            // First try regular referral codes
            const regularRes = await fetch('/api/referral-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: codeToValidate.trim(),
                    order_amount: checkoutAmount
                })
            });

            const regularData = await regularRes.json();

            if (regularData.valid) {
                setAppliedCode({
                    code: regularData.code,
                    discount_type: regularData.discount_type,
                    discount_amount: regularData.discount_amount,
                    isPartnerReferral: false
                });
                setReferralCode('');
                return;
            }

            // If not a regular code, try partner referral codes
            const partnerRes = await fetch('/api/partner-referrals/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: codeToValidate.trim(),
                    order_amount: checkoutAmount,
                    customer_email: formData.email || undefined
                })
            });

            const partnerData = await partnerRes.json();

            if (partnerData.valid) {
                setAppliedCode({
                    code: partnerData.code,
                    discount_type: partnerData.user_discount_type,
                    discount_amount: partnerData.discount_amount,
                    isPartnerReferral: true,
                    partnerName: partnerData.partner_name
                });
                setReferralCode('');
                return;
            }

            // Neither valid - show appropriate error
            const error = partnerData.error || regularData.error || 'Invalid code';
            setReferralError(error);
            if (codeToValidate !== referralCode) setReferralCode(codeToValidate);
        } catch (_error) {
            setReferralError('Failed to validate code');
        } finally {
            setValidatingCode(false);
        }
    };

    const handleApplyReferralCode = () => {
        validateCode(referralCode);
    };

    useEffect(() => {
        const codeFromUrl = searchParams.get('referralCode');
        if (codeFromUrl && !appliedCode) {
            validateCode(codeFromUrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        const validatePromoPrice = async () => {
            if ((!urlPromoPrice && !urlPromoCode) || !itemId || isCartCheckout) return;

            try {
                const res = await fetch('/api/promo-prices/validate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        planId: itemId,
                        promoPrice: urlPromoPrice ? parseFloat(urlPromoPrice) : undefined,
                        promoCode: urlPromoCode || undefined
                    })
                });

                const data = await res.json();

                if (data.valid) {
                    setPromoPrice(data.promoPrice);
                    setOriginalPlanPrice(data.originalPrice);
                    setPromoPriceValid(true);
                    setPromoPriceError('');
                    setResolvedPromoCode(data.promoCode || null);
                } else {
                    setPromoPriceError(data.error || 'Invalid promo');
                    setPromoPriceValid(false);
                }
            } catch {
                setPromoPriceError('Failed to validate promo');
                setPromoPriceValid(false);
            }
        };

        validatePromoPrice();
    }, [urlPromoPrice, urlPromoCode, itemId, isCartCheckout]);

    const handleRemoveReferralCode = () => {
        setAppliedCode(null);
        setReferralError('');
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            document.body.appendChild(script);
        } else if (typeof window !== 'undefined' && window.Razorpay) {
            setScriptLoaded(true);
        }
    }, []);

    useEffect(() => {
        const isBasicValid =
            formData.name.length > 2 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData.mobile.length >= 10;

        const isAddressValid = isCartCheckout
            ? formData.address.length > 5 && formData.city.length > 2 && formData.pincode.length >= 6
            : true;

        const isCollegeValid = singleItem?.type === 'internship' ? formData.college.length > 2 : true;

        const isPromoPriceValid = (urlPromoPrice || urlPromoCode) ? promoPriceValid === true : true;

        const isItemReady = isCartCheckout || (!isLoadingItem && !itemFetchError && singleItem !== null);

        setIsFormValid(isBasicValid && isAddressValid && isCollegeValid && isPromoPriceValid && isItemReady);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, isCartCheckout, singleItem?.type, urlPromoPrice, promoPriceValid, isLoadingItem, itemFetchError, singleItem]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async () => {
        if (!scriptLoaded || isLoading || !isFormValid) return;
        setIsLoading(true);

        if (isCartCheckout && items.length > 0) {
            try {
                const priceValidationRes = await fetch('/api/products');
                const productsData = await priceValidationRes.json();

                const priceChanges: string[] = [];

                for (const cartItem of items) {
                    const dbProduct = productsData.products?.find((p: any) => p.id.toString() === cartItem.id);
                    if (dbProduct && Math.abs(dbProduct.price - cartItem.price) > 0.01) {
                        priceChanges.push(
                            `${cartItem.name}: ₹${cartItem.price} → ₹${dbProduct.price}`
                        );
                    }
                }

                if (priceChanges.length > 0) {
                    const confirmProceed = confirm(
                        `Price changes detected:\n\n${priceChanges.join('\n')}\n\nPlease refresh your cart to see updated prices. Continue anyway?`
                    );

                    if (!confirmProceed) {
                        setIsLoading(false);
                        return;
                    }
                }

                const stockCheckRes = await fetch('/api/check-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity }))
                    }),
                });

                const stockData = await stockCheckRes.json();

                if (!stockData.available) {
                    const unavailableNames = stockData.unavailableItems?.map((item: any) =>
                        `${item.name} (${item.reason})`
                    ).join(', ') || 'Some items';

                    alert(`Unable to proceed: ${unavailableNames}. Please update your cart.`);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('Pre-checkout validation failed:', error);
                alert('Unable to verify cart. Please try again.');
                setIsLoading(false);
                return;
            }
        }

        const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

        if (devMode) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const fakePaymentId = `dev_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

            try {
                const verifyRes = await fetch('/api/razorpay/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_payment_id: fakePaymentId,
                        razorpay_order_id: `dev_order_${Date.now()}`,
                        razorpay_signature: 'dev_mode_signature',
                        dev_mode: true,
                        metadata: {
                            ...formData,
                            items: isCartCheckout ? items : [singleItem],
                            totalAmount: finalAmount,
                            originalAmount: checkoutAmount,
                            referralCode: appliedCode && !appliedCode.isPartnerReferral ? appliedCode.code : null,
                            partnerReferralCode: appliedCode?.isPartnerReferral ? appliedCode.code : null,
                            discountAmount: appliedCode?.discount_amount || 0,
                            type: isCartCheckout ? 'shop_order' : singleItem?.type
                        }
                    }),
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    await handlePaymentSuccess(fakePaymentId);
                }
            } catch (error) {
                console.error('Dev mode payment failed:', error);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    originalAmount: checkoutAmount,
                    referralCode: appliedCode?.code || null,
                    discountAmount: appliedCode?.discount_amount || 0,
                    itemId: isCartCheckout ? 'cart_checkout' : singleItem?.id,
                    itemName: checkoutItemName,
                    promoPrice: promoPriceValid ? promoPrice : null,
                    originalPlanPrice: originalPlanPrice,
                    metadata: {
                        ...formData,
                        items: isCartCheckout ? items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })) : null,
                        type: isCartCheckout ? 'shop_order' : singleItem?.type,
                        referralCode: appliedCode && !appliedCode.isPartnerReferral ? appliedCode.code : null,
                        partnerReferralCode: appliedCode?.isPartnerReferral ? appliedCode.code : null,
                        discountAmount: appliedCode?.discount_amount || 0,
                        originalAmount: checkoutAmount,
                        promoPrice: promoPriceValid ? promoPrice : null,
                        promoCode: resolvedPromoCode,
                        originalPlanPrice: originalPlanPrice
                    }
                }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await orderRes.json();

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ZecurX',
                description: checkoutItemName,
                order_id: orderData.orderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyRes = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                metadata: {
                                    ...formData,
                                    items: isCartCheckout ? items : [singleItem],
                                    totalAmount: checkoutAmount,
                                    type: isCartCheckout ? 'shop_order' : singleItem?.type
                                }
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            await handlePaymentSuccess(response.razorpay_payment_id);
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.mobile,
                },
                theme: { color: '#2b96e2' },
                modal: { ondismiss: () => setIsLoading(false) },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentId: string) => {
        setPurchaseComplete(true);

        try {
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    address: isCartCheckout ? `${formData.address}, ${formData.city} - ${formData.pincode}` : undefined,
                    formType: isCartCheckout ? 'shop_order' : 'purchase',
                    items: isCartCheckout ? items : undefined,
                    itemName: checkoutItemName,
                    price: finalAmount,
                    originalPrice: checkoutAmount,
                    discountAmount: appliedCode?.discount_amount || 0,
                    paymentId,
                }),
            });

            if (isCartCheckout) {
                clearCart();
            }
        } catch (error) {
            console.error('Email error:', error);
        }

        setIsLoading(false);
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isCartCheckout && items.length === 0 && !purchaseComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <button onClick={() => router.push('/shop')} className="text-primary hover:underline">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!isCartCheckout && isLoadingItem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!isCartCheckout && itemFetchError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Unable to Load Item</h2>
                    <p className="text-muted-foreground mb-4">{itemFetchError}</p>
                    <button onClick={() => router.back()} className="text-primary hover:underline">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!isCartCheckout && (!singleItem?.id || !singleItem?.name)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Invalid Checkout Session</h2>
                    <button onClick={() => router.back()} className="text-primary hover:underline">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (purchaseComplete) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-muted/20 p-8 rounded-3xl border border-border/50 backdrop-blur-sm"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
                    <p className="text-muted-foreground mb-8">
                        Thank you for your order! A confirmation email has been sent to {formData.email}.
                        {isCartCheckout && " We'll ship your items within the estimated delivery time."}
                    </p>
                    <button
                        onClick={() => router.push(isCartCheckout ? '/shop' : '/academy')}
                        className="w-full py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                    >
                        {isCartCheckout ? 'Continue Shopping' : 'Explore Courses'}
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            <div className="pt-32 pb-20 max-w-6xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                            <p className="text-muted-foreground">
                                {isCartCheckout
                                    ? 'Enter your shipping details to complete the order.'
                                    : 'Please enter your details to complete the purchase.'}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </div>
                            </div>

                            {isCartCheckout && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Shipping Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="House/Flat No., Street, Landmark"
                                                rows={2}
                                                className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Mumbai"
                                                className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium ml-1">PIN Code</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="400001"
                                                className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {singleItem?.type === 'internship' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium ml-1">College / Institution</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="college"
                                            value={formData.college}
                                            onChange={handleInputChange}
                                            placeholder="Enter your college name"
                                            className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
                            <Lock className="w-3 h-3" />
                            Your personal information is encrypted and secure.
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-32">
                        <div className="bg-muted/10 border border-border/50 rounded-3xl p-8 backdrop-blur-md">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            {isCartCheckout ? (
                                <div className="space-y-4 pb-6 border-b border-border/50 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-muted/50 overflow-hidden shrink-0 relative">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="pb-6 border-b border-border/50 mb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium">{singleItem?.name}</span>
                                        <div className="text-right">
                                            {promoPriceValid && originalPlanPrice && promoPrice !== originalPlanPrice ? (
                                                <>
                                                    <span className="text-sm text-muted-foreground line-through mr-2">{formatPrice(originalPlanPrice)}</span>
                                                    <span className="font-bold text-green-500">{formatPrice(singleItem?.price || 0)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold">{formatPrice(singleItem?.price || 0)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider bg-muted p-1 px-2 rounded">
                                            {singleItem?.type}
                                        </span>
                                        {promoPriceValid && originalPlanPrice && promoPrice !== originalPlanPrice && (
                                            <span className="text-xs text-green-600 uppercase tracking-wider bg-green-500/10 p-1 px-2 rounded border border-green-500/30">
                                                Special Offer
                                            </span>
                                        )}
                                    </div>
                                    {promoPriceError && (
                                        <p className="text-xs text-red-500 mt-2">{promoPriceError}</p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(checkoutAmount)}</span>
                                </div>
                                {isCartCheckout && (
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Shipping</span>
                                        <span className="text-green-500">Free</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax (Included)</span>
                                    <span>₹0</span>
                                </div>

                                {/* Referral Code Section */}
                                <div className="pt-3 border-t border-border/30">
                                    {appliedCode ? (
                                        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <Ticket className="w-4 h-4 text-green-500" />
                                                <div>
                                                    <span className="text-sm font-medium text-green-500">{appliedCode.code}</span>
                                                    {appliedCode.isPartnerReferral && appliedCode.partnerName && (
                                                        <span className="text-xs text-green-500/70 block">via {appliedCode.partnerName}</span>
                                                    )}
                                                </div>
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
                                                        className="w-full bg-muted/30 border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleApplyReferralCode}
                                                    disabled={!referralCode.trim() || validatingCode}
                                                    className="px-4 py-2.5 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors"
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
                                    <div className="flex justify-between text-sm text-green-500">
                                        <span>Discount</span>
                                        <span>-{formatPrice(appliedCode.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/50">
                                    <span>Total</span>
                                    <span>{formatPrice(finalAmount)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!isFormValid || isLoading || !scriptLoaded}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isFormValid && !isLoading
                                    ? 'bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] shadow-foreground/20 cursor-pointer'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        {isFormValid ? `Pay ${formatPrice(finalAmount)}` : 'Enter Details to Pay'}
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70">
                                <Shield className="w-3 h-3" />
                                Secured by Razorpay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-muted rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
