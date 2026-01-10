"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { Mail, MapPin, Phone, ArrowUpRight, Loader2, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            formType: 'contact'
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
                (e.target as HTMLFormElement).reset();
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to send message');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            value: "official@zecurx.com",
            href: "mailto:official@zecurx.com",
        },
        {
            icon: Phone,
            title: "Phone",
            value: "+91 7488813601",
            href: "tel:+917488813601",
        },
        {
            icon: MapPin,
            title: "Office",
            value: "Bengaluru, India",
            href: null,
        }
    ];

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30">
            <CreativeNavBar />

            <section className="w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Content */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold tracking-tight text-foreground">
                                Contact Us
                            </h1>
                            <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-md">
                                We help enterprises secure their digital assets. Reach out to discuss how we can help you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="h-px w-full bg-border" />

                            <div className="grid gap-8">
                                {contactMethods.map((method) => (
                                    <div key={method.title} className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-background group-hover:border-primary/50 transition-colors">
                                            <method.icon className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium block mb-1">
                                                {method.title}
                                            </span>
                                            {method.href ? (
                                                <Link
                                                    href={method.href}
                                                    className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                                                >
                                                    {method.value}
                                                </Link>
                                            ) : (
                                                <span className="text-lg font-medium text-foreground">{method.value}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-muted/5 border border-border rounded-2xl p-8 lg:p-10">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <CheckCircle2 className="w-12 h-12 text-foreground mb-4" />
                                <h3 className="text-xl font-medium mb-2">Message Sent</h3>
                                <p className="text-muted-foreground mb-8">
                                    We'll get back to you shortly.
                                </p>
                                <Button
                                    onClick={() => setIsSuccess(false)}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    Send Another
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                                    <input
                                        name="name"
                                        id="name"
                                        type="text"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                                    <select
                                        name="subject"
                                        id="subject"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option>Sales Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-medium text-base transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
