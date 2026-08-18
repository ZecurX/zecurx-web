"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Users, Calendar, Ticket, CreditCard, X } from "lucide-react";
import Link from "next/link";

interface RazorpayMethodConfig {
    display?: {
        blocks?: Record<string, { name: string; instruments: { method: string }[] }>;
        sequence?: string[];
        preferences?: { show_default_blocks?: boolean };
    };
}

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
    config?: RazorpayMethodConfig;
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

// Surfaces EMI as a payment method for lump-sum charges. Whether EMI actually appears still
// depends on Razorpay having it enabled on the merchant account and the card issuer supporting it.
const EMI_CHECKOUT_CONFIG: RazorpayMethodConfig = {
    display: {
        blocks: {
            emi: { name: 'Pay via EMI', instruments: [{ method: 'emi' }] },
            other: { name: 'Other Payment Methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }, { method: 'upi' }] },
        },
        sequence: ['block.emi', 'block.other'],
        preferences: { show_default_blocks: false },
    },
};

interface Slot {
    id: string;
    name: string;
    startDate: string;
    seatsRemaining: number;
}

interface AppliedCoupon {
    code: string;
    discountAmount: number;
    isPartnerReferral: boolean;
    partnerName?: string;
}

interface BookingFormProps {
    courseId: string;
    courseTitle: string;
    coursePrice: number;
}

const DEPOSIT_AMOUNT = 2000;

export default function BookingForm({ courseId, courseTitle, coursePrice }: BookingFormProps) {
    const router = useRouter();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [couponError, setCouponError] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [showCouponField, setShowCouponField] = useState(false);

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

    const discountBaseAmount = paymentOption === 'full' ? coursePrice : coursePrice - DEPOSIT_AMOUNT;

    // Re-validate against the new base amount if the payment option changes while a coupon is applied.
    useEffect(() => {
        if (appliedCoupon) {
            validateCoupon(appliedCoupon.code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentOption]);

    const validateCoupon = async (codeToValidate: string) => {
        if (!codeToValidate.trim()) return;
        setValidatingCoupon(true);
        setCouponError('');

        try {
            const regularRes = await fetch('/api/referral-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: codeToValidate.trim(), order_amount: discountBaseAmount }),
            });
            const regularData = await regularRes.json();

            if (regularRes.status >= 500) {
                setCouponError(regularData.error || 'Service temporarily unavailable. Please try again later.');
                return;
            }

            if (regularData.valid) {
                setAppliedCoupon({ code: regularData.code, discountAmount: regularData.discount_amount, isPartnerReferral: false });
                setCouponInput('');
                return;
            }

            const partnerRes = await fetch('/api/partner-referrals/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: codeToValidate.trim(), order_amount: discountBaseAmount, customer_email: formData.email || undefined }),
            });
            const partnerData = await partnerRes.json();

            if (partnerRes.status >= 500) {
                setCouponError(partnerData.error || 'Service temporarily unavailable. Please try again later.');
                return;
            }

            if (partnerData.valid) {
                setAppliedCoupon({
                    code: partnerData.code,
                    discountAmount: partnerData.discount_amount,
                    isPartnerReferral: true,
                    partnerName: partnerData.partner_name,
                });
                setCouponInput('');
                return;
            }

            setCouponError(partnerData.error || regularData.error || 'Invalid code');
        } catch {
            setCouponError('Failed to validate code');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isFormValid =
        !!selectedSlotId &&
        formData.name.trim().length > 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
        formData.phone.trim().length >= 10;

    const discountAmount = appliedCoupon?.discountAmount || 0;
    const remainingAfterDeposit = Math.max(0, coursePrice - DEPOSIT_AMOUNT - discountAmount);
    const fullCharge = Math.max(0, coursePrice - discountAmount);
    const amountDueNow = paymentOption === 'deposit' ? DEPOSIT_AMOUNT : fullCharge;

    const handleBook = async () => {
        if (!isFormValid || !scriptLoaded || isSubmitting) return;
        setIsSubmitting(true);
        setError('');

        try {
            const orderRes = await fetch('/api/academy/bookings/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    batchId: selectedSlotId,
                    ...formData,
                    paymentOption,
                    referralCode: appliedCoupon && !appliedCoupon.isPartnerReferral ? appliedCoupon.code : undefined,
                    partnerReferralCode: appliedCoupon?.isPartnerReferral ? appliedCoupon.code : undefined,
                    discountAmount: appliedCoupon?.discountAmount || 0,
                }),
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
                description: `${paymentOption === 'full' ? 'Course Payment' : 'Slot Booking'} - ${orderData.courseName}`,
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
                            router.push(`/academy/booking/${verifyData.bookingToken}`);
                        } else {
                            setError(verifyData.error || 'Payment verification failed');
                            setIsSubmitting(false);
                        }
                    } catch {
                        setError('Payment verification failed. Please contact support.');
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
                ...(paymentOption === 'full' ? { config: EMI_CHECKOUT_CONFIG } : {}),
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
    const formatMoney = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    if (loadingSlots) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="text-center py-10 space-y-4">
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    No batches are currently open for booking. Get in touch and we&apos;ll help you find the next available slot.
                </p>
                <Link
                    href="/contact"
                    className="inline-block bg-[#4c69e4] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#3b57d4] transition-all"
                >
                    Contact Us
                </Link>
            </div>
        );
    }

    return (
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

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Payment Option
                </label>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        type="button"
                        onClick={() => setPaymentOption('deposit')}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                            paymentOption === 'deposit'
                                ? 'border-[#4c69e4] bg-[#4c69e4]/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                        }`}
                    >
                        <p className="text-sm font-semibold text-white">Pay ₹{DEPOSIT_AMOUNT.toLocaleString('en-IN')} Now, Rest in 15 Days</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Then {formatMoney(remainingAfterDeposit)}{discountAmount > 0 && (
                                <span className="text-slate-500 line-through ml-1">{formatMoney(coursePrice - DEPOSIT_AMOUNT)}</span>
                            )} within 15 days
                        </p>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPaymentOption('full')}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                            paymentOption === 'full'
                                ? 'border-[#4c69e4] bg-[#4c69e4]/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">Pay Full Amount Now</p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                <CreditCard className="w-3 h-3" />
                                EMI Available on Credit Cards
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {formatMoney(fullCharge)}{discountAmount > 0 && (
                                <span className="text-slate-500 line-through ml-1">{formatMoney(coursePrice)}</span>
                            )}
                        </p>
                    </button>
                </div>
            </div>

            {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">{appliedCoupon.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-emerald-400">-{formatMoney(appliedCoupon.discountAmount)}</span>
                        <button
                            onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                            className="p-1 hover:bg-emerald-500/20 rounded transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                    </div>
                </div>
            ) : showCouponField ? (
                <div className="space-y-1.5">
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                            placeholder="Enter coupon code"
                            className="flex-1 h-10 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm uppercase text-white placeholder:text-slate-500 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#4c69e4]/50"
                        />
                        <button
                            onClick={() => validateCoupon(couponInput)}
                            disabled={!couponInput.trim() || validatingCoupon}
                            className="px-4 h-10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white rounded-lg transition-colors"
                        >
                            {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                        </button>
                    </div>
                    {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowCouponField(true)}
                    className="flex items-center gap-1.5 text-xs text-[#7b93f5] hover:text-[#9db0f9] transition-colors"
                >
                    <Ticket className="w-3.5 h-3.5" />
                    Have a coupon code?
                </button>
            )}

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
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-[#4c69e4] text-white hover:bg-[#3b57d4] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    `Pay ${formatMoney(amountDueNow)} ${paymentOption === 'deposit' ? 'to Book Your Slot' : 'Now'}`
                )}
            </button>
            <p className="text-xs text-slate-500 text-center">
                {paymentOption === 'deposit'
                    ? 'Secures your seat. The remaining course fee is payable within 15 days.'
                    : 'Full course fee, paid securely via Razorpay.'}
            </p>
            <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                {courseTitle} · By continuing you agree to our{' '}
                <Link href="/terms-of-service" className="underline hover:text-slate-400">Terms of Service</Link>.
            </p>
        </div>
    );
}
