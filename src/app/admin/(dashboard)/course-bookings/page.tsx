"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, ClipboardList, CheckCircle2, AlertTriangle, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Booking {
    id: string;
    customerName: string | null;
    customerEmail: string;
    customerPhone: string | null;
    courseName: string;
    batchName: string;
    status: 'pending_deposit' | 'slot_booked' | 'fully_paid' | 'cancelled';
    badge: 'paid' | 'payment_due' | 'fully_paid' | null;
    paymentOption: 'deposit' | 'full';
    depositAmount: number;
    totalAmount: number;
    amountPaid: number;
    discountAmount: number;
    couponCode: string | null;
    courseAccessEnabled: boolean;
    createdAt: string;
}

const BADGE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    paid: { label: 'Paid', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle2 },
    payment_due: { label: 'Payment Due', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: AlertTriangle },
    fully_paid: { label: 'Fully Paid', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: BadgeCheck },
};

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function CourseBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append('search', debouncedSearch);
            const res = await fetch(`/api/admin/course-bookings?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleToggleAccess = async (booking: Booking) => {
        try {
            const res = await fetch(`/api/admin/course-bookings/${booking.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseAccessEnabled: !booking.courseAccessEnabled }),
            });
            if (res.ok) fetchBookings();
        } catch (error) {
            console.error('Failed to update booking access:', error);
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Course Bookings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Track slot bookings, payment status, and course access
                </p>
            </div>

            <div className="flex gap-4 p-4 bg-card/40 border border-border/50 rounded-xl">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or course..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-card/40 border border-border/50 rounded-xl">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No bookings yet</h3>
                    <p className="text-muted-foreground mt-1">Slot bookings will appear here once someone pays the deposit</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => {
                        const badgeConfig = booking.badge ? BADGE_CONFIG[booking.badge] : null;
                        const BadgeIcon = badgeConfig?.icon;
                        return (
                            <div
                                key={booking.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card/40 border border-border/50 rounded-xl hover:bg-card/60 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-foreground">
                                            {booking.customerName || booking.customerEmail}
                                        </h3>
                                        {badgeConfig && BadgeIcon && (
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                badgeConfig.color
                                            )}>
                                                <BadgeIcon className="w-3 h-3" />
                                                {badgeConfig.label}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.courseName} &middot; {booking.batchName}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {booking.customerEmail}{booking.customerPhone ? ` · ${booking.customerPhone}` : ''}
                                    </p>
                                    <p className="text-sm text-foreground mt-2 font-medium">
                                        {formatCurrency(booking.amountPaid)} / {formatCurrency(booking.totalAmount)} paid
                                        <span className="text-xs text-muted-foreground font-normal ml-2">
                                            ({booking.paymentOption === 'full' ? 'paid in full' : 'deposit + balance'})
                                        </span>
                                    </p>
                                    {booking.couponCode && (
                                        <p className="text-xs text-emerald-600 mt-1">
                                            Coupon {booking.couponCode} applied — {formatCurrency(booking.discountAmount)} off
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => handleToggleAccess(booking)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg transition-colors text-sm font-medium border",
                                            booking.courseAccessEnabled
                                                ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                        )}
                                    >
                                        {booking.courseAccessEnabled ? 'Access Enabled' : 'Enable Access'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
