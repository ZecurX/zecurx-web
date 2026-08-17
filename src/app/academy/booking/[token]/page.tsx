"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, Loader2, Calendar, CreditCard } from "lucide-react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
}

function getRazorpayConstructor(): new (options: RazorpayOptions) => RazorpayInstance {
    return (window as unknown as { Razorpay: new (options: RazorpayOptions) => RazorpayInstance }).Razorpay;
}

interface BookingDetails {
    courseName: string;
    batchName: string;
    batchStartDate: string;
    status: 'pending_deposit' | 'slot_booked' | 'fully_paid' | 'cancelled';
    badge: 'paid' | 'payment_due' | 'fully_paid' | null;
    depositAmount: number;
    totalAmount: number;
    amountPaid: number;
    remainingBalance: number;
    paymentDueAt: string | null;
    customerName: string | null;
}

const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
    paid: { label: 'Paid', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    payment_due: { label: 'Payment Due', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    fully_paid: { label: 'Fully Paid', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export default function BookingStatusPage() {
    const params = useParams();
    const token = params.token as string;

    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const fetchBooking = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/academy/bookings/${token}`);
            if (res.status === 404) {
                setNotFound(true);
                return;
            }
            const data = await res.json();
            setBooking(data);
        } catch {
            setError('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as unknown as { Razorpay?: unknown }).Razorpay) {
            setScriptLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    const handlePayBalance = async () => {
        if (!scriptLoaded || isPaying) return;
        setIsPaying(true);
        setError('');

        try {
            const orderRes = await fetch(`/api/academy/bookings/${token}/balance/create-order`, {
                method: 'POST',
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to start payment');
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ZecurX',
                description: `Balance Payment - ${orderData.courseName}`,
                order_id: orderData.orderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyRes = await fetch(`/api/academy/bookings/${token}/balance/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            await fetchBooking();
                        } else {
                            setError(verifyData.error || 'Payment verification failed');
                        }
                    } catch {
                        setError('Payment verification failed. Please contact support.');
                    } finally {
                        setIsPaying(false);
                    }
                },
                theme: { color: '#4c69e4' },
                modal: { ondismiss: () => setIsPaying(false) },
            };

            const RazorpayCtor = getRazorpayConstructor();
            const razorpay = new RazorpayCtor(options);
            razorpay.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsPaying(false);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <main className="min-h-screen bg-[#080b14] flex flex-col font-sans text-white">
            <CreativeNavBar />

            <div className="flex-1 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-lg mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : notFound ? (
                        <div className="text-center py-24">
                            <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
                            <p className="text-slate-400">This booking link is invalid or has expired.</p>
                        </div>
                    ) : booking ? (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">Your Booking</h1>
                                {booking.badge && (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${BADGE_CONFIG[booking.badge].color}`}>
                                        {booking.badge === 'payment_due' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                        {BADGE_CONFIG[booking.badge].label}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Course</p>
                                    <p className="text-lg font-semibold">{booking.courseName}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    {booking.batchName} — starts {formatDate(booking.batchStartDate)}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Total Course Fee</span>
                                    <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Amount Paid</span>
                                    <span className="font-medium text-emerald-400">{formatCurrency(booking.amountPaid)}</span>
                                </div>
                                {booking.remainingBalance > 0 && (
                                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-white/10">
                                        <span>Remaining Balance</span>
                                        <span>{formatCurrency(booking.remainingBalance)}</span>
                                    </div>
                                )}
                            </div>

                            {booking.status === 'fully_paid' ? (
                                <p className="text-sm text-slate-300 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                    You&apos;re all set! Our team will enable your course access shortly and reach out with onboarding details.
                                </p>
                            ) : (
                                <>
                                    {booking.badge === 'payment_due' && (
                                        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                                            Your payment is overdue. Please complete payment to retain your slot.
                                        </p>
                                    )}
                                    {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
                                    <button
                                        onClick={handlePayBalance}
                                        disabled={isPaying || !scriptLoaded}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-[#4c69e4] text-white hover:bg-[#3b57d4] transition-all disabled:opacity-40"
                                    >
                                        {isPaying ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4" />
                                                Pay Remaining {formatCurrency(booking.remainingBalance)}
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            <Footer />
        </main>
    );
}
