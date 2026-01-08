"use client";

import React, { useState } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { Mail, MapPin, Phone, ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

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

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative overflow-hidden">
            <CreativeNavBar />

            <section className="relative w-full pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Info */}
                    <div>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                            Get in Touch.
                        </h1>
                        <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed mb-12 max-w-lg">
                            Have questions about our platform or services? Our team is ready to help you secure your enterprise.
                        </p>

                        <div className="space-y-12">
                            {/* Contact Methods */}
                            <div className="flex flex-col gap-6">
                                <div className="p-6 rounded-2xl bg-muted/5 border border-border hover:border-foreground/20 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Email Us</h3>
                                            <p className="text-muted-foreground mb-3 text-sm">For general questions and partnership opportunities.</p>
                                            <Link href="mailto:info@zecurx.com" className="inline-flex items-center gap-2 font-medium hover:underline">
                                                info@zecurx.com <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-muted/5 border border-border hover:border-foreground/20 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Call Us</h3>
                                            <p className="text-muted-foreground mb-3 text-sm">Speak directly with our team.</p>
                                            <Link href="tel:+917488813601" className="inline-flex items-center gap-2 font-medium hover:underline">
                                                +91 7488813601 <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-muted/5 border border-border hover:border-foreground/20 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">Headquarters</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Bel Road<br />
                                                Bengaluru 560094<br />
                                                India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-background border border-border rounded-3xl p-8 md:p-12 h-fit">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Thank you for reaching out. We'll get back to you soon.
                                </p>
                                <Button onClick={() => setIsSuccess(false)} variant="outline">
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                                        <input name="name" id="name" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Full Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                                        <input name="email" id="email" type="email" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="name@company.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
                                    <select name="subject" id="subject" className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors appearance-none">
                                        <option>Sales Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Partnership</option>
                                        <option>Media / Press</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
                                    <textarea name="message" id="message" rows={5} required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors resize-none" placeholder="How can we help you?" />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-base"
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
