"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, ArrowLeft, ShoppingBag, Truck, CheckCircle, Clock } from 'lucide-react';
import CreativeNavBar from '@/components/landing/CreativeNavBar';
import Footer from '@/components/landing/Footer';

interface OrderItem {
    product_id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    id: number;
    order_id: string;
    payment_id: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_pincode: string;
    total_amount: number;
    order_status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
}

const statusIcons: Record<string, typeof Package> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
};

const statusColors: Record<string, string> = {
    pending: 'text-yellow-500',
    processing: 'text-blue-500',
    shipped: 'text-purple-500',
    delivered: 'text-green-500',
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const fetchOrders = async (customerEmail: string, customerOrderId: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/orders?email=${encodeURIComponent(customerEmail)}&orderId=${encodeURIComponent(customerOrderId)}`);
            const data = await res.json();

            if (res.ok) {
                setOrders(data.orders || []);
                setEmailSubmitted(true);
            } else {
                console.error('Failed to fetch orders:', data.error);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && orderId.trim()) {
            fetchOrders(email.trim(), orderId.trim());
        }
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (!emailSubmitted) {
        return (
            <main className="min-h-screen bg-background">
                <CreativeNavBar />
                <div className="pt-32 pb-20 max-w-2xl mx-auto px-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="bg-muted/10 border border-border/50 rounded-3xl p-8 backdrop-blur-md">
                        <div className="text-center mb-8">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <h1 className="text-3xl font-bold mb-2">View Your Order</h1>
                            <p className="text-muted-foreground">
                                Enter your email and order ID to view your order details
                            </p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium ml-1 block mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium ml-1 block mb-2">Order ID</label>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="order_xxxxxxxxxxxx"
                                    required
                                    className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                            >
                                View Orders
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <CreativeNavBar />
                <div className="pt-32 pb-20 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="h-4 w-32 bg-muted rounded"></div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <CreativeNavBar />

            <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
                    <p className="text-muted-foreground">
                        Showing orders for {email}
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-muted/10 border border-border/50 rounded-3xl p-12 text-center">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                        <p className="text-muted-foreground mb-6">
                            You haven&apos;t placed any orders yet
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const StatusIcon = statusIcons[order.order_status] || Package;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-muted/10 border border-border/50 rounded-2xl p-6 backdrop-blur-sm"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center ${statusColors[order.order_status] || 'text-foreground'}`}>
                                                <StatusIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">Order #{order.order_id.slice(-8)}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Placed on {formatDate(order.created_at)}
                                                </p>
                                                <p className="text-sm capitalize mt-1">
                                                    <span className={statusColors[order.order_status] || 'text-foreground'}>
                                                        {order.order_status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
                                            <button
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                                            >
                                                {isExpanded ? 'Hide Details' : 'View Details'}
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-border/50 pt-4 space-y-4"
                                        >
                                            <div>
                                                <h4 className="font-semibold mb-3">Items</h4>
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-muted/20 rounded-lg p-3">
                                                            <div>
                                                                <p className="font-medium">{item.product_name}</p>
                                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.shipping_address}
                                                    <br />
                                                    {order.shipping_city} - {order.shipping_pincode}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Payment ID</p>
                                                    <p className="font-mono text-xs">{order.payment_id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Contact</p>
                                                    <p>{order.customer_phone}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
