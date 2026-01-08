"use client";

import React, { useState } from "react";
import CreativeNavBar from "@/components/landing/CreativeNavBar";
import Footer from "@/components/landing/Footer";
import { MoveRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookDemoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get('first-name') as string;
        const lastName = formData.get('last-name') as string;

        const data = {
            name: `${firstName} ${lastName}`,
            email: formData.get('email'),
            company: formData.get('company'),
            role: formData.get('role'),
            message: `Demo request from ${firstName} ${lastName} at ${formData.get('company')}. Role: ${formData.get('role')}`,
            formType: 'demo'
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to submit request');
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

            <section className="relative w-full min-h-screen flex flex-col lg:flex-row pt-24 lg:pt-0">

                {/* Left Side: Content */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10">
                    <div className="max-w-xl space-y-8">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-foreground/5 text-sm font-medium text-muted-foreground mb-6">
                                Schedule a Demo
                            </span>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-foreground mb-6 relative z-20">
                                See ZecurX in <span className="text-muted-foreground">Action.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-manrope font-normal leading-relaxed">
                                Experience how our unified security platform minimizes risk, automates compliance, and accelerates your security engineering workflows.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            {[
                                "Full platform walkthrough tailored to your infrastructure",
                                "Deep dive into AI-driven threat detection",
                                "Custom implementation roadmap",
                                "Q&A with a Lead Security Engineer"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-foreground mt-1 shrink-0" />
                                    <span className="text-lg text-foreground/80 font-light">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10 lg:border-l lg:border-border/40">
                    <div className="w-full max-w-lg bg-background p-8 lg:p-12">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center text-center py-12">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">Demo Request Received!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Thank you for your interest. Our team will reach out within 24 hours to schedule your personalized demo.
                                </p>
                                <Button onClick={() => setIsSuccess(false)} variant="outline">
                                    Submit Another Request
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-manrope font-medium mb-2">Get Started</h3>
                                    <p className="text-muted-foreground text-sm">Fill out the form below and we'll be in touch shortly.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="first-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</label>
                                            <input name="first-name" id="first-name" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Jane" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="last-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</label>
                                            <input name="last-name" id="last-name" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work Email</label>
                                        <input name="email" id="email" type="email" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="jane@company.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</label>
                                        <input name="company" id="company" type="text" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors" placeholder="Acme Corp" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</label>
                                        <select name="role" id="role" defaultValue="" required className="w-full bg-muted/20 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-foreground/50 transition-colors appearance-none">
                                            <option value="" disabled>Select your role</option>
                                            <option value="CISO / CSO">CISO / CSO</option>
                                            <option value="Security Director">Security Director</option>
                                            <option value="Security Engineer">Security Engineer</option>
                                            <option value="Developer">Developer</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium text-base flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Request Demo
                                                <MoveRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground pt-4">
                                        By submitting this form, you acknowledge that you have read and understood our Privacy Policy.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
