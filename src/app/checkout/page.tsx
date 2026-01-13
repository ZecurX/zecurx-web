"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, ArrowLeft, Mail, Phone, User as UserIcon, CheckCircle2, GraduationCap } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';
import RazorpayCheckout from '@/components/academy/RazorpayCheckout';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        college: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);

    const item = {
        id: searchParams.get('itemId') || '',
        name: searchParams.get('itemName') || '',
        price: Number(searchParams.get('price')) || 0,
        type: searchParams.get('type') || 'course'
    };

    // Validate form
    useEffect(() => {
        const isBasicValid =
            formData.name.length > 2 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData.mobile.length >= 10;

        // Require college if type is internship
        const isCollegeValid = item.type === 'internship' ? formData.college.length > 2 : true;

        setIsFormValid(isBasicValid && isCollegeValid);
    }, [formData, item.type]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSuccess = async (paymentId: string) => {
        setPurchaseComplete(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile,
                    college: formData.college,
                    formType: 'purchase',
                    itemName: item.name,
                    itemId: item.id,
                    price: item.price,
                    paymentId,
                }),
            });

            if (!response.ok) throw new Error('Failed to send confirmation email');

        } catch (error) {
            console.error('Email error:', error);
            // Even if email fails, payment was successful, so we show success state
        }
    };

    if (!item.id || !item.name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Invalid Checkout Session</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-primary hover:underline"
                    >
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
                    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for purchasing <strong>{item.name}</strong>. A confirmation email has been sent to {formData.email}.
                    </p>
                    <button
                        onClick={() => router.push('/academy')}
                        className="w-full py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                    >
                        Explore Courses
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

                    {/* Left: Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                            <p className="text-muted-foreground">Please enter your details to complete the purchase.</p>
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

                            {/* College Field - Only for Internships */}
                            {item.type === 'internship' && (
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

                    {/* Right: Order Summary */}
                    <div className="lg:sticky lg:top-32">
                        <div className="bg-muted/10 border border-border/50 rounded-3xl p-8 backdrop-blur-md">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="pb-6 border-b border-border/50 mb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider bg-muted p-1 px-2 rounded">
                                    {item.type}
                                </span>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax (Included)</span>
                                    <span>₹0</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/50">
                                    <span>Total</span>
                                    <span>₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <RazorpayCheckout
                                itemId={item.id}
                                itemName={item.name}
                                itemDescription={`Purchase of ${item.name} by ${formData.email}`}
                                amount={item.price}
                                metadata={{
                                    mobile: formData.mobile,
                                    email: formData.email,
                                    name: formData.name,
                                    type: item.type,
                                    college: formData.college,
                                    itemName: item.name
                                }}
                                onSuccess={handlePaymentSuccess}
                                disabled={!isFormValid}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isFormValid
                                    ? 'bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] shadow-foreground/20 cursor-pointer'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                {isFormValid ? `Pay ₹${item.price.toLocaleString('en-IN')}` : 'Enter Details to Pay'}
                            </RazorpayCheckout>

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
