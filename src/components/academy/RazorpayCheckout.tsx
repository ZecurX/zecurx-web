'use client';

import { useEffect, useState } from 'react';

// Razorpay types
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
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
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

interface RazorpayCheckoutProps {
    itemId: string;
    itemName: string;
    itemDescription?: string;
    amount: number;
    metadata?: Record<string, any>;
    onSuccess?: (paymentId: string) => void;
    onFailure?: (error: string) => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export default function RazorpayCheckout({
    itemId,
    itemName,
    itemDescription,
    amount,
    metadata,
    onSuccess,
    onFailure,
    children,
    className = '',
    disabled = false,
}: RazorpayCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Load Razorpay script
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
                onFailure?.('Failed to load payment gateway');
            };
            document.body.appendChild(script);
        } else if (window.Razorpay) {
            setScriptLoaded(true);
        }
    }, [onFailure]);

    const handlePayment = async () => {
        if (!scriptLoaded || isLoading || disabled) return;

        setIsLoading(true);

        // DEV MODE: Skip Razorpay and simulate success
        const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
        if (devMode) {
            // Simulate a short delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Generate a fake payment ID
            const fakePaymentId = `dev_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

            // Call verify API with dev mode flag
            try {
                const verifyRes = await fetch('/api/razorpay/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_payment_id: fakePaymentId,
                        razorpay_order_id: `dev_order_${Date.now()}`,
                        razorpay_signature: 'dev_mode_signature',
                        dev_mode: true,
                        metadata: metadata
                    }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    onSuccess?.(fakePaymentId);
                } else {
                    onFailure?.(verifyData.error || 'Dev mode verification failed');
                }
            } catch (error) {
                onFailure?.('Dev mode payment failed');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            // Create order on server
            const orderRes = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, itemId, itemName, metadata }),
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await orderRes.json();

            // Initialize Razorpay checkout
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ZecurX',
                description: itemDescription || itemName,
                order_id: orderData.orderId,
                handler: async (response: RazorpayResponse) => {
                    // Verify payment on server
                    try {
                        const verifyRes = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            onSuccess?.(response.razorpay_payment_id);
                        } else {
                            onFailure?.(verifyData.error || 'Payment verification failed');
                        }
                    } catch (error) {
                        onFailure?.('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#2b96e2ff', // ZecurX accent color
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            onFailure?.(error instanceof Error ? error.message : 'Payment failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isLoading || disabled || !scriptLoaded}
            className={className}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
}
