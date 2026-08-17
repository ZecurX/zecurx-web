"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Loader2, CheckCircle2, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: { name?: string; email?: string; contact?: string };
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

interface Slot {
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    capacity: number;
    seatsRemaining: number;
}

interface BookSlotModalProps {
    courseId: string;
    courseTitle: string;
    onClose: () => void;
}

const DEPOSIT_AMOUNT = 2000;

export default function BookSlotModal({ courseId, courseTitle, onClose }: BookSlotModalProps) {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [bookingResult, setBookingResult] = useState<{ bookingToken: string; totalAmount: number } | null>(null);

    useEffect(() => {
        fetch(`/api/academy/courses/${courseId}/slots`)
            .then((res) => res.json())
            .then((data) => setSlots(data.slots || []))
            .catch(() => setError('Failed to load available batches'))
            .finally(() => setLoadingSlots(false));
    }, [courseId]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isFormValid =
        !!selectedSlotId &&
        formData.name.trim().length > 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        formData.phone.trim().length >= 10;

    const handleBook = async () => {
        if (!isFormValid || !scriptLoaded || isSubmitting) return;
        setIsSubmitting(true);
        setError('');

        try {
            const orderRes = await fetch('/api/academy/bookings/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batchId: selectedSlotId, ...formData }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to start booking');
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ZecurX',
                description: `Slot Booking - ${orderData.courseName}`,
                order_id: orderData.orderId,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyRes = await fetch('/api/academy/bookings/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            setBookingResult({
                                bookingToken: verifyData.bookingToken,
                                totalAmount: orderData.totalAmount,
                            });
                        } else {
                            setError(verifyData.error || 'Payment verification failed');
                        }
                    } catch {
                        setError('Payment verification failed. Please contact support.');
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: '#4c69e4' },
                modal: { ondismiss: () => setIsSubmitting(false) },
            };

            const RazorpayCtor = getRazorpayConstructor();
            const razorpay = new RazorpayCtor(options);
            razorpay.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-[#0d1020] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
                >
                    <div className="flex items-start justify-between p-6 pb-2 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {bookingResult ? 'Slot Booked!' : 'Book Your Slot'}
                            </h2>
                            {!bookingResult && (
                                <p className="text-sm text-slate-400 mt-1">{courseTitle}</p>
                            )}
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 pt-4 overflow-y-auto">
                        {bookingResult ? (
                            <div className="flex flex-col items-center text-center space-y-4 py-2">
                                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        Your ₹{DEPOSIT_AMOUNT.toLocaleString('en-IN')} deposit is confirmed and your seat is reserved.
                                        We&apos;ve emailed you a link to pay the remaining ₹{(bookingResult.totalAmount - DEPOSIT_AMOUNT).toLocaleString('en-IN')} balance within 15 days.
                                    </p>
                                </div>
                                <Link
                                    href={`/academy/booking/${bookingResult.bookingToken}`}
                                    className="text-sm text-[#7b93f5] hover:text-[#9db0f9] underline"
                                >
                                    View your booking status
                                </Link>
                                <Button onClick={onClose} variant="outline" className="w-full mt-2">
                                    Close
                                </Button>
                            </div>
                        ) : loadingSlots ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-6 space-y-3">
                                <p className="text-slate-400 text-sm">
                                    No batches are currently open for booking. Get in touch and we&apos;ll help you find the next available slot.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-block bg-[#4c69e4] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#3b57d4] transition-all"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Choose a Batch
                                    </label>
                                    <div className="space-y-2">
                                        {slots.map((slot) => {
                                            const isFull = slot.seatsRemaining <= 0;
                                            const isSelected = selectedSlotId === slot.id;
                                            return (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    disabled={isFull}
                                                    onClick={() => setSelectedSlotId(slot.id)}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                                        isSelected
                                                            ? 'border-[#4c69e4] bg-[#4c69e4]/10'
                                                            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                                    }`}
                                                >
                                                    <p className="text-sm font-semibold text-white">{slot.name}</p>
                                                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(slot.startDate)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            {isFull ? 'Full' : `${slot.seatsRemaining} seats left`}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/50"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/50"
                                    />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Mobile Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/50"
                                    />
                                </div>

                                {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

                                <button
                                    onClick={handleBook}
                                    disabled={!isFormValid || isSubmitting || !scriptLoaded}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#4c69e4] text-white hover:bg-[#3b57d4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        `Pay ₹${DEPOSIT_AMOUNT.toLocaleString('en-IN')} to Book Your Slot`
                                    )}
                                </button>
                                <p className="text-xs text-slate-500 text-center">
                                    Secures your seat. The remaining course fee is payable within 15 days.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}
